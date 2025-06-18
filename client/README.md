# ReembolsaBB - Front

O front-end do ReembolsaBB é uma aplicação web moderna construída com Next.js e TypeScript. Ele oferece uma interface de usuário para upload de comprovantes de despesas e visualização dos resultados da análise de reembolso.

## Tecnologias Utilizadas

- Framework: Next.js 15.3.3
- Linguagem: TypeScript
- Estilização: Tailwind CSS
- Componentes UI: shadcn/ui, Radix UI
- Requisições HTTP: Axios

## Pré-requisitos

- Node.js (versão 20 ou superior recomendada)
- Yarn (gerenciador de pacotes)

## Estrutura de Arquivos Relevantes

```
/client
|-- /src
|   |-- /app
|   |   |-- /teste                # Página de teste para upload de arquivos
|   |   |-- globals.css           # Estilos globais e importação de fontes
|   |   |-- layout.tsx            # Layout principal da aplicação
|   |   |-- page.tsx              # Página inicial da aplicação
|   |-- /components
|   |   |-- /ui                   # Componentes da interface do usuário (ex: Button, Dialog)
|   |-- /lib
|   |   |-- utils.ts              # Funções utilitárias
|-- package.json                  # Dependências e scripts do projeto
|-- next.config.ts                # Arquivo de configuração do Next.js
|-- tailwind.config.ts            # Arquivo de configuração do Tailwind CSS
```

## Como Executar no Projeto

1. Navegue até o diretório do cliente:

```bash
cd client
```

2. Instale as dependências:

O projeto utiliza `Yarn` como gerenciador de pacotes. Para instalar as dependências, execute:

```bash
yarn install
```

3. Inicie o servidor de desenvolvimento:

Após a instalação das dependências, inicie a aplicação com o seguinte comando:

```bash
yarn dev
```

4. Acesse a aplicação:

Abra seu navegador e acesse http://localhost:3000 para ver a aplicação em funcionamento. A página principal (/) contém a interface de upload de arquivos.
