<div style="width: 100%; margin: 0 auto;">
   <img src="cape.svg" alt="capa reembolsabb" style="width:100%" />
</div>

# ReembolsaBB

Sistema desenvolvido para o Banco do Brasil durante a Residência Tecnológica da Universidade Católica de Brasília.

Este projeto consiste em um sistema de reembolso automatizado que utiliza inteligência artificial para processar e analisar comprovantes de despesas. A aplicação é dividida em um front-end para interação do usuário e um back-end que lida com a lógica de negócio e processamento de imagens.

## Como Executar o Projeto

Para obter instruções detalhadas sobre como configurar e executar cada parte da aplicação, por favor, consulte a documentação específica de cada módulo.

### Frontend (Cliente)

O front-end é construído com Next.js e TypeScript e fornece a interface para upload dos comprovantes.

- Para instruções detalhadas de instalação e execução, acesse o [README do Front-end](client/README.md).

### Backend (Servidor)

O back-end é uma API em Python com FastAPI, responsável por processar as imagens com o Google Cloud Vision e aplicar as regras de negócio.

- Para instruções detalhadas de instalação e execução, acesse o [README do Back-end](server/README.md).
