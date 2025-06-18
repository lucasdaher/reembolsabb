from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from app.core.processing import process_reimbursement_image

router = APIRouter()

@router.post("/process-reimbursement/")
async def create_upload_file(file: UploadFile = File(...)):
    """
    Recebe um arquivo de imagem, processa e retorna a análise do reembolso.
    """
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="O arquivo enviado não é uma imagem.")

    try:
        image_content = await file.read()
        result = process_reimbursement_image(image_content)
        return JSONResponse(content=result)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ConnectionError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        # Erro genérico para não expor detalhes de implementação
        raise HTTPException(status_code=500, detail=f"Ocorreu um erro interno ao processar a imagem: {e}")
