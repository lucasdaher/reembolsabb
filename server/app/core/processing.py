import io
import os
import json
import re
from google.cloud import vision
from google.oauth2 import service_account

def parse_receipt_text(text: str):
    # Padrões para CNPJ e Data
    cnpj_pattern = r'\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}'
    date_pattern = r'\d{2}/\d{2}/\d{4}'

    cnpj_match = re.search(cnpj_pattern, text)
    date_match = re.search(date_pattern, text)

    cnpj = cnpj_match.group(0) if cnpj_match else "Não encontrado"
    data = date_match.group(0) if date_match else "Não encontrada"
    valor = 0.0
    found_by_keyword = False

    keywords = ['TOTAL', 'VALOR TOTAL', 'VALOR A PAGAR', 'VALOR BRUTO', 'VALOR LÍQUIDO']

    for line in text.splitlines():
        if any(keyword in line.upper() for keyword in keywords):
            found_numbers = re.findall(r'[\d.,]+', line)

            if found_numbers:
                potential_value_str = found_numbers[-1]
                cleaned_value_str = potential_value_str.replace('.', '').replace(',', '.')

                try:
                    valor = float(cleaned_value_str)
                    found_by_keyword = True
                    break
                except ValueError:
                    continue

    # Caso a primeira tentativa de validação falhe, recorre a esta aqui
    if not found_by_keyword:
        all_numbers_str = re.findall(r'[\d.,]+', text)
        max_value = 0.0

        for num_str in all_numbers_str:
            try:
                # Limpa e converte cada número encontrado no recibo
                cleaned_str = num_str.replace('.', '').replace(',', '.')
                current_value = float(cleaned_str)

                # Atualiza o valor máximo encontrado
                if current_value > max_value:
                    max_value = current_value
            except ValueError:
                continue

        valor = max_value

    return {
        "cnpj": cnpj,
        "data": data,
        "valor": valor
    }


def categorize_receipt(text: str):
    """Analisa o texto para categorizar a despesa."""
    text_lower = text.lower()
    if any(keyword in text_lower for keyword in ["hotel", "hospedagem", "diaria"]):
        return "Hospedagem"
    if any(keyword in text_lower for keyword in ["restaurante", "refeicao", "alimentos", "cupom fiscal"]):
        return "Alimentação"
    return "Outros"

def apply_business_rules(valor: float, categoria: str):
    """Aplica as regras de negócio definidas."""
    limites = {
        "Alimentação": 200.00,
        "Hospedagem": 1500.00
    }
    limite = limites.get(categoria)
    if limite and valor > limite:
        return {
            "status": "Reprovado Automaticamente",
            "motivo": f"Valor (R$ {valor:.2f}) excede o limite de R$ {limite:.2f} para a categoria '{categoria}'."
        }
    return {"status": "Aprovado", "motivo": None}

def process_reimbursement_image(image_content: bytes):
    credentials_json_str = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS_JSON')
    if not credentials_json_str:
        raise ConnectionError("Credenciais do Google Cloud não encontradas nas variáveis de ambiente.")

    credentials_info = json.loads(credentials_json_str)
    credentials = service_account.Credentials.from_service_account_info(credentials_info)
    client = vision.ImageAnnotatorClient(credentials=credentials)
    image = vision.Image(content=image_content)

    response = client.text_detection(image=image)
    texts = response.text_annotations

    if not texts:
        raise ValueError("Nenhum texto detectado na imagem. A imagem pode estar em branco ou corrompida.")

    extracted_text = texts[0].description

    dados_extraidos = parse_receipt_text(extracted_text)
    categoria = categorize_receipt(extracted_text)
    resultado_regras = apply_business_rules(dados_extraidos["valor"], categoria)

    final_response = {
        "categoria": categoria,
        "valor": dados_extraidos["valor"],
        "cnpj_fornecedor": dados_extraidos["cnpj"],
        "data": dados_extraidos["data"],
        "status": resultado_regras["status"],
        "motivo": resultado_regras.get("motivo")
    }

    return final_response
