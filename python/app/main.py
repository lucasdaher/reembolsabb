from fastapi import FastAPI, Body, HTTPException
from minio import Minio
import pytesseract
from PIL import Image
import io
import re
import cv2
import numpy as np

app = FastAPI()

minio_client = Minio(
    endpoint="minio:9000",
    access_key="miniouser",
    secret_key="miniopassword",
    secure=False,
)

def preprocess_image(image_bytes: bytes) -> Image.Image:
    # carrega image como array OpenCV
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    denoised = cv2.bilateralFilter(gray, 9, 75, 75)

    thresh = cv2.adaptiveThreshold(
        denoised, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        11, 2
    )

    coords = np.column_stack(np.where(thresh > 0))
    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
    (h, w) = thresh.shape
    M = cv2.getRotationMatrix2D((w//2, h//2), angle, 1.0)
    deskewed = cv2.warpAffine(thresh, M, (w, h),
                              flags=cv2.INTER_CUBIC,
                              borderMode=cv2.BORDER_REPLICATE)

    return Image.fromarray(deskewed)

@app.post("/ocr")
async def ocr_process(bucket: str = Body(...), object_name: str = Body(...)):
    try:
        resp = minio_client.get_object(bucket, object_name)
        data = resp.read()
    except Exception as e:
        raise HTTPException(404, f"Arquivo não encontrado: {e}")

    # pré-processa a imagem
    img_proc = preprocess_image(data)

    # chama o Tesseract (PSM 6 = assume bloco uniforme de texto; OEM 3 = neural nets + legacy)
    custom_config = r'--oem 3 --psm 6 -l por'
    text = pytesseract.image_to_string(img_proc, config=custom_config)

    return {"text": text}

# Regex patterns
CNPJ_REGEX = re.compile(r'(\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2})')
DATE_REGEX = re.compile(r'(\d{2}[/-]\d{2}[/-]\d{4})')
VALUE_REGEX = re.compile(r'R?\$?\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))')

@app.post("/parse")
async def parse_nf(text: str = Body(..., embed=True)):
    # Campo CNPJ
    cnpj_match = CNPJ_REGEX.search(text)
    cnpj = cnpj_match.group(1) if cnpj_match else None

    # Campo Data
    date_match = DATE_REGEX.search(text)
    date = date_match.group(1) if date_match else None

    # Campo Valor (pega último valor encontrado, que costuma ser o total)
    values = VALUE_REGEX.findall(text)
    valor = values[-1] if values else None

    if not any([cnpj, date, valor]):
        raise HTTPException(status_code=422, detail="Não foi possível extrair CNPJ, data ou valor")

    return {
        "cnpj": cnpj,
        "data": date,
        "valor_total": valor
    }
