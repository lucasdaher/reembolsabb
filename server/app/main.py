from fastapi import FastAPI
from .api import endpoints
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="ReembolsaBB API",
    version="1.0.0"
)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui as rotas definidas no arquivo de endpoints
app.include_router(endpoints.router, prefix="/api/v1", tags=["Reimbursement"])

@app.get("/", tags=["Health Check"])
def read_root():
    """Endpoint inicial para verificar se a API está no ar."""
    return {"status": "ok", "message": "ReembolsaBB API está rodando!"}
