# PRD — Buscador de repositórios no GitHub

## 1. Visão geral

Criar uma página que permita pesquisar repositórios públicos do GitHub por palavra-chave. O usuário informa um termo, pressiona `Enter` e recebe uma lista com até 10 repositórios encontrados.

## 2. Objetivo

Facilitar a descoberta de repositórios do GitHub e apresentar as informações mais relevantes de cada resultado de forma simples, rápida e organizada.

## 3. Funcionalidades

### 3.1. Campo de busca

- Exibir um campo no qual o usuário possa digitar uma palavra-chave.
- Iniciar a pesquisa somente quando o usuário pressionar `Enter`.
- Não realizar a busca quando o campo estiver vazio ou contiver apenas espaços.

### 3.2. Busca de repositórios

- Pesquisar repositórios públicos relacionados ao termo informado.
- Exibir no máximo 10 resultados.
- Ordenar os resultados pelo número de estrelas.

### 3.3. Resultado da busca

Cada repositório deve ser apresentado em um card contendo:

- nome e foto do autor;
- nome do repositório;
- descrição do repositório;
- linguagem principal utilizada;
- número de estrelas;
- link direto para o repositório no GitHub.

O link deve abrir a página correspondente ao repositório.

### 3.4. Estados da interface

- **Inicial:** orientar o usuário a digitar um termo para começar.
- **Carregando:** informar que a pesquisa está sendo realizada.
- **Sucesso:** exibir os repositórios encontrados.
- **Sem resultados:** apresentar uma mensagem amigável quando nenhum repositório for encontrado.
- **Erro:** informar de forma clara quando a busca não puder ser concluída.

## 4. Diretrizes visuais

- Centralizar o conteúdo da página.
- Limitar a largura do conteúdo a `700px`.
- Utilizar um fundo mais escuro do que os cards.
- Apresentar o campo de busca dentro de um card com bordas arredondadas.
- Apresentar cada resultado em um card com bordas arredondadas.
- Manter boa legibilidade e funcionamento em telas menores.

## 5. Decisões técnicas

### 5.1. API

Utilizar a API pública de busca de repositórios do GitHub:

```text
https://api.github.com/search/repositories?q={PALAVRA-CHAVE}&sort=stars&per_page=10
```

O valor `{PALAVRA-CHAVE}` deve ser substituído pelo termo digitado pelo usuário e codificado antes de ser incluído na URL.

### 5.2. Requisição

- Realizar a chamada à API com `fetch`.
- Utilizar `async/await`.
- Envolver a requisição em um bloco `try/catch`.
- Verificar `response.ok` antes de processar a resposta.
- Tratar falhas de rede e respostas de erro da API.

### 5.3. Eventos e manipulação da página

- Definir todos os eventos no arquivo JavaScript.
- Não utilizar eventos inline no HTML, como `onclick` ou `onkeydown`.
- Detectar a tecla `Enter` pelo evento do formulário ou do campo de busca.
- Atualizar os estados da interface por meio do JavaScript.

## 6. Critérios de aceite

- Ao digitar um termo e pressionar `Enter`, a aplicação inicia a busca.
- Durante a requisição, um estado de carregamento fica visível.
- A aplicação exibe até 10 repositórios ordenados por estrelas.
- Cada resultado apresenta todas as informações definidas neste documento.
- Uma busca sem resultados exibe uma mensagem amigável.
- Uma falha na requisição exibe uma mensagem de erro compreensível.
- Um campo vazio não dispara uma requisição.
- Nenhum evento JavaScript é declarado diretamente no HTML.

## 7. Fora do escopo

- Autenticação no GitHub.
- Paginação dos resultados.
- Filtros avançados por linguagem, autor ou quantidade de estrelas.
- Favoritar ou salvar repositórios.
