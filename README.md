# Social Postify

## Descrição
O "Social Postify" é um aplicativo web que permite aos usuários criar e agendar publicações para várias redes sociais, como Facebook, Instagram, Twitter e LinkedIn.

Os usuários podem criar publicações personalizadas com imagens, títulos, texto e selecionar a data e horário específicos para cada publicação. O sistema suporta o agendamento de várias publicações e fornece uma visão geral clara das postagens programadas.

Este é um projeto em Nest.js. Segue abaixo as instruções de configuração:

Certifiquse-se de ter as seguintes ferramentas instaladas e atualizadas no seu sistema: 

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)


## Instalação

Siga estas etapas para configurar e executar o projeto localmente:

```bash
   git clone https://github.com/anarehder/social-postify.git
   cd social-postify
```

### 1 - Instalar as dependencias
```bash
  npm install
```
### 2 - Configurar a variavel de ambiente

Crie um arquivo .env na raiz do projeto com a variavel de ambiente necessária. Você pode usar o arquivo .env.example como um modelo.

### 3 - Configurar o banco de dados com o Prisma

Execute as seguintes etapas
```bash
  npx prisma generate
  npx prisma migrate dev
```

### 4 - Execute o projeto em modo desenvolvimento

```bash
  npm run start:dev
```

## 5 - Uso

A porta utilizada padrão do Nest pe a porta 3000.
As rotas disponíveis são:
  - medias
  - posts
  - publications

Para todas as rotas possuímos POST, GET, PUT e DELETE.

Na ausência de campos obrigatórios, retorne o status code 400 Bad Request.

Se não houver nenhum registro compatível, retornar status code 404 Not Found.

Se você tentar deletar algo que faça parte de uma publicação (agendada ou publicada). Neste caso, retornar o status code 403 Forbidden.

As rotas disponíveis são:
  - POST/nomeDaRota
  - GET/nomeDaRota
  - GET/nomeDaRota/:id
  - PUT/nomeDaRota/:id
  - DELETE/nomeDaRota/:id

As medias representam as redes sociais nas quais as publicações (publications) serão feitas, por exemplo: Facebook, Instagram, Twitter, LinkedIn, Threads, etc.

Para fazer ou editar uma media o body deve ter o formato:
```bash
  {
	"title": "Instagram",
	"username": "myusername",
  }
```
Os posts representam os conteúdos que serão postados nas redes sociais (medias) por meio de uma publicação (publication):

Para fazer ou editar um post o body deve ter o formato:
```bash
  {
	"title": "Why you should have a guinea pig?",
	"text": "https://www.guineapigs.com/why-you-should-guinea",
  }
```
As publicações são os agendamentos dos posts nas redes sociais (medias).

Para fazer ou editar uma publicação o body deve ter o formato:
```bash
  {
	"mediaId": 1,
	"postId": 1,
	"date": "2023-08-21T13:25:17.352Z"
  }
```

## 6 - Testes
Crie um arquivo .env.test de maneira análoga ao .env.example mas crie um banco secundário para testes.

Para executá-los, use o comando 
```bash
  npm run test:e2e
```

### 7 - Para subir o projeto no modo de produção

```bash
  npm run build
```
