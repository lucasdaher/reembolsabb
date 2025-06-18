# ReembolsaBB - Back

O back-end do ReembolsaBB é uma API RESTful desenvolvida em Python usando o framework FastAPI. Ele é responsável por receber os comprovantes, processá-los utilizando a API do Google Cloud Vision e aplicar as regras de negócio para aprovar ou reprovar o reembolso.

## Tecnologias Utilizadas

- Framework: FastAPI
- Linguagem: Python
- Banco de Dados: PostgreSQL (gerenciado via Docker)
- Processamento de Imagem: Google Cloud Vision API
- Servidor WSGI: Uvicorn
- Containerização: Docker

## Pré-requisitos

- Docker e Docker Compose
- Conta de Serviço do Google Cloud com a API Vision habilitada.

## Estrutura de Arquivos Relevantes

```
/server
|-- /app
|   |-- /api
|   |   |-- endpoints.py          # Define os endpoints da API, como o de processamento de reembolso
|   |-- /core
|   |   |-- processing.py         # Contém a lógica de negócio para processar e analisar as imagens dos comprovantes
|   |-- main.py                   # Ponto de entrada da aplicação FastAPI, configuração de CORS e rotas
|-- requirements.txt              # Lista de dependências Python do projeto
|-- .env                          # Arquivo para variáveis de ambiente (credenciais, etc.)
/docker-compose.yml               # Arquivo para orquestrar os contêineres do back-end e do banco de dados
```

## Como Executar o Projeto

1. Configuração do Ambiente:

- Crie um arquivo .env dentro da pasta server.
- Obtenha o JSON da sua credencial de serviço do Google Cloud e adicione-o a uma variável de ambiente chamada GOOGLE_APPLICATION_CREDENTIALS_JSON dentro do arquivo .env. O conteúdo do arquivo deve ser a string JSON em uma única linha.

```
GOOGLE_APPLICATION_CREDENTIALS_JSON='{"type": "service_account", "project_id": "...", ...}'
```

- O arquivo `docker-compose.yml` já está configurado para carregar este arquivo de variáveis de ambiente no serviço de backend.

2. Inicie os contêineres Docker:

Na raiz do projeto (diretório `reembolsabb`), execute o seguinte comando para construir e iniciar os contêineres do back-end e do banco de dados:

```bash
docker-compose up --build
```

Este comando irá:

- Construir a imagem Docker para o serviço backend com base no Dockerfile localizado em `./server`.
- Baixar e iniciar um contêiner do `postgres:14-alpine` para o serviço de banco de dados db.
- Montar o diretório local `./server` no contêiner `/app`, permitindo o hot-reloading de alterações no código.
- Expor a porta 8000 para a API do back-end e a porta 5432 para o banco de dados.

3. Acesse a API:

- A API estará disponível em `http://localhost:8000`.
- Você pode acessar a documentação interativa gerada pelo FastAPI (Swagger UI) em `http://localhost:8000/docs` para visualizar e testar os endpoints.
- O endpoint principal para verificar a saúde da API está em `http://localhost:8000/`.

## Endpoint Principal

- `POST /api/v1/process-reimbursement/`:
  - **Descrição:** Recebe um arquivo de imagem (PNG, JPG, etc.) de um comprovante para análise.
  - **Corpo da Requisição:** multipart/form-data com um campo file contendo a imagem.
  - **Resposta de Sucesso:** Um JSON com o resultado da análise, incluindo status (aprovado/reprovado), categoria, valor, CNPJ e data.
  - **Respostas de Erro**:
    - `400 Bad Request:` Se o arquivo não for uma imagem ou se nenhum texto for detectado.
    - `500 Internal Server Error:` Para erros internos no processamento, como falha na conexão com a API do Google.
