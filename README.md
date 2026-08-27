# Cardápio Digital com Avaliações

![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

Sistema de cardápio por QR Code para hamburguerias, com **notas de 0 a 10 dadas pelos
próprios clientes** e painel administrativo para o dono.

O cliente senta na mesa, aponta a câmera para o QR Code e vê o cardápio completo — foto,
ingredientes, preço e a **nota média de quem já comeu aquele lanche**. Depois de comer, ele
dá a própria nota. Menos tempo decidindo, zero gasto com cardápio de papel.

**Uma instalação por estabelecimento**: cada cliente que compra o sistema roda a própria
cópia, com o próprio banco de dados e a própria senha. Nada é compartilhado entre lojas.

---

## Como rodar

Requisitos: **Node.js 20+** e um banco **MongoDB**. O jeito mais rápido de ter um é o
[MongoDB Atlas](https://www.mongodb.com/cloud/atlas), que tem plano gratuito.

```bash
npm install
```

Crie o arquivo de ambiente a partir do exemplo:

```bash
cp .env.example .env
```

No Atlas, vá em **Connect → Drivers**, copie a string de conexão e cole no `DATABASE_URL`
do `.env`, trocando a senha e **incluindo o nome do banco depois da barra** — sem ele o
Prisma não sobe:

```env
DATABASE_URL="mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/cardapio?retryWrites=true&w=majority"
```

Crie as coleções e o acesso inicial do painel:

```bash
npm run db:push
```

```bash
npm run db:seed
```

O `db:seed` mostra no terminal o e-mail e a senha do painel (definidos em `ADMIN_EMAIL` e
`ADMIN_PASSWORD` no `.env`) e cria um cardápio de exemplo para você ver o sistema
funcionando. Depois é só subir:

```bash
npm run dev
```

- Cardápio do cliente: <http://localhost:3000>
- Painel do dono: <http://localhost:3000/admin>

> Troque a senha padrão no primeiro acesso, em **Configurações → Trocar senha**.

---

## O que o sistema faz

### Cardápio (o que o cliente vê)

- Foto, nome em destaque, ingredientes, preço e nota média de cada lanche
- Carrossel **Mais pedidos** com os itens que o dono marcou como destaque
- Busca por nome ou por ingrediente ("quero algo com bacon")
- Navegação por categorias com a aba acompanhando a rolagem
- Toque no lanche → ficha completa e **avaliação de 0 a 10** com comentário opcional
- Um voto por aparelho por lanche — o cliente pode mudar a própria nota, mas não votar duas vezes
- Feito para o celular: tudo alcança o polegar, e funciona igual no computador

### Painel do dono (`/admin`)

| Página | O que faz |
| --- | --- |
| **Resumo** | Nota da casa, total de avaliações, ticket médio, ranking dos melhores avaliados |
| **Lanches** | Cadastrar, editar, apagar, ocultar, destacar e reordenar |
| **Categorias** | Criar e ordenar as seções do cardápio |
| **Avaliações** | Ler os comentários e apagar avaliações abusivas |
| **QR Code** | Cartão de mesa pronto para imprimir, além de PNG e link |
| **Configurações** | Nome, logo, frase, horário, contatos, e-mail de acesso e troca de senha |

Ocultar um lanche tira ele do cardápio **sem apagar** as avaliações — bom para quando
acaba o estoque no meio da noite.

---

## Recuperação de senha

O dono clica em *Esqueci minha senha* e recebe um link válido por 1 hora no e-mail
cadastrado em **Configurações → E-mail de acesso**.

Para o e-mail sair de verdade, preencha os dados de SMTP no `.env`:

```env
SMTP_HOST="smtp.seuprovedor.com"
SMTP_PORT="587"
SMTP_USER="contato@hamburgueria.com.br"
SMTP_PASS="a-senha-do-e-mail"
SMTP_FROM="Cardapio Digital <contato@hamburgueria.com.br>"
```

Sem SMTP configurado o sistema não quebra: no computador o link é gravado em
`.mail-dev.log` e, onde o disco é somente leitura (Vercel), ele aparece no log do
servidor — dá para testar tudo antes de colocar no ar.

---

## Colocar no ar na Vercel

### 1. Banco no MongoDB Atlas

1. Crie um cluster (o gratuito M0 dá conta de uma hamburgueria).
2. Em **Database Access**, crie um usuário com senha.
3. Em **Network Access**, libere `0.0.0.0/0`. Os endereços da Vercel são dinâmicos, então
   não há uma faixa fixa para autorizar — a proteção fica por conta do usuário e da senha.
4. Em **Connect → Drivers**, copie a string de conexão e acrescente o nome do banco.

### 2. Projeto na Vercel

1. Suba o repositório no GitHub e importe em **Add New → Project**. A Vercel reconhece o
   Next.js sozinha; não mexa no comando de build.
2. Em **Storage**, crie um **Blob Store** e conecte ao projeto. É onde ficam as fotos dos
   lanches — a `BLOB_READ_WRITE_TOKEN` entra sozinha nas variáveis.
3. Em **Settings → Environment Variables**, preencha:

| Variável | Valor |
| --- | --- |
| `DATABASE_URL` | a string do Atlas, com o nome do banco |
| `APP_URL` | o endereço público (ex.: `https://cardapio-da-loja.vercel.app`) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | dados do e-mail |

`ADMIN_EMAIL` e `ADMIN_PASSWORD` **não precisam ir para a Vercel** — servem só ao
`db:seed`, que roda da sua máquina.

### 3. Primeiro deploy

Só se sabe o endereço final depois do primeiro deploy. Então: publique, copie a URL,
coloque em `APP_URL` e mande republicar (**Deployments → Redeploy**).

### 4. Popular o banco

Como o banco é o mesmo do Atlas, dá para preparar tudo da sua máquina — basta o `.env`
local apontar para ele:

```bash
npm run db:push
npm run db:seed
```

### 5. QR Code

No painel, em **Configurações → Endereço do cardápio**, coloque o endereço público. Depois
vá em **QR Code**, imprima e distribua nas mesas.

> ⚠️ O QR Code precisa apontar para o endereço público. Se ele apontar para `localhost`,
> só funciona no seu computador.

### Detalhes que costumam pegar

- **Foto de até 4 MB.** A Vercel recusa requisições acima de 4,5 MB antes de elas chegarem
  no sistema, então o painel avisa quando a imagem passa disso.
- **Reordenar lanches exige replica set.** Subir e descer item usa transação, o que o
  MongoDB só aceita em replica set. Todo cluster do Atlas já é um; um `mongod` avulso
  instalado na mão, não.
- **SMTP em servidor serverless** funciona, mas é lento e alguns provedores bloqueiam. Se
  virar dor de cabeça, trocar o `nodemailer` por uma API HTTP de e-mail mexe só em
  `src/lib/mail.ts`.
- **Backup** é responsabilidade do Atlas (snapshots no painel dele) e do Blob. Não há mais
  arquivo de banco para copiar à mão.

---

## Vender para outro estabelecimento

Cada venda é uma instalação limpa:

1. Crie um banco novo no Atlas e um projeto novo na Vercel, com o próprio Blob Store.
2. Configure as variáveis de ambiente com o `ADMIN_EMAIL` e o `ADMIN_PASSWORD` do novo dono.
3. Rode `npm run db:push` e `npm run db:seed` apontando para o banco novo.
4. Entregue o acesso — o dono ajusta nome, logo, cardápio e endereço pelo painel.

Como cada instalação tem banco próprio, os dados de um estabelecimento nunca encostam nos
de outro.

---

## Tecnologia

- **Next.js 16** (App Router, Server Actions) + **React 19** + **TypeScript**
- **Tailwind CSS 4** com tema preto / laranja / branco
- **Prisma 6** + **MongoDB** (um banco por instalação)
- **Vercel Blob** nas fotos, com queda para `public/uploads/` quando não há token
- **framer-motion** nas animações, **qrcode** no cartão de mesa, **nodemailer** no e-mail
- Sessão em cookie `httpOnly` com token no banco; senha com **bcrypt**

## Estrutura

```
prisma/schema.prisma        modelos: Store, Category, Product, Review, Session, PasswordReset
prisma/seed.ts              acesso inicial + cardápio de exemplo
src/app/page.tsx            cardápio público
src/app/admin/              login, recuperação de senha e painel
src/app/actions/            server actions (avaliações, CRUD, autenticação)
src/components/             cartões, folha de avaliação, formulários do painel
src/lib/                    prisma, sessão, upload, e-mail, formatação
src/app/globals.css         tema, tipografia e animações
```

---

## Licença

Projeto proprietário — todos os direitos reservados a Lucas Felipe Martins.
O código não é livre para redistribuição; cada instalação é licenciada ao
estabelecimento que a contrata.
