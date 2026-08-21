# Cardápio Digital com Avaliações

Sistema de cardápio por QR Code para hamburguerias, com **notas de 0 a 10 dadas pelos
próprios clientes** e painel administrativo para o dono.

O cliente senta na mesa, aponta a câmera para o QR Code e vê o cardápio completo — foto,
ingredientes, preço e a **nota média de quem já comeu aquele lanche**. Depois de comer, ele
dá a própria nota. Menos tempo decidindo, zero gasto com cardápio de papel.

**Uma instalação por estabelecimento**: cada cliente que compra o sistema roda a própria
cópia, com o próprio banco de dados e a própria senha. Nada é compartilhado entre lojas.

---

## Como rodar

Requisitos: **Node.js 20+**.

```bash
npm install
```

Crie o arquivo de ambiente a partir do exemplo e ajuste os valores:

```bash
cp .env.example .env
```

Crie o banco e o acesso inicial do painel:

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

Sem SMTP configurado o sistema não quebra: o link é gravado em `.mail-dev.log`, o que serve
para testar tudo antes de colocar no ar.

---

## Colocar no ar

1. Aponte um domínio para o servidor (ex.: `cardapio.suahamburgueria.com.br`).
2. No `.env` do servidor, ajuste `APP_URL` para esse endereço.
3. Rode `npm run build` e depois `npm start`.
4. No painel, em **Configurações → Endereço do cardápio**, coloque o mesmo endereço.
5. Vá em **QR Code**, imprima e distribua nas mesas.

> ⚠️ O QR Code precisa apontar para o endereço público. Se ele apontar para `localhost`,
> só funciona no seu computador.

### O que preservar em cada atualização

- `prisma/dev.db` — o banco com cardápio e avaliações
- `public/uploads/` — as fotos dos lanches
- `.env` — as configurações da instalação

Faça uma cópia desses três antes de qualquer atualização.

---

## Vender para outro estabelecimento

Cada venda é uma instalação limpa:

1. Copie o projeto (sem `prisma/dev.db` e sem `public/uploads/`).
2. Crie o `.env` com o `ADMIN_EMAIL` e o `ADMIN_PASSWORD` do novo dono.
3. Rode `npm run db:push` e `npm run db:seed`.
4. Entregue o acesso — o dono ajusta nome, logo, cores de identidade e cardápio pelo painel.

Como cada instalação tem banco próprio, os dados de um estabelecimento nunca encostam nos
de outro.

---

## Tecnologia

- **Next.js 16** (App Router, Server Actions) + **React 19** + **TypeScript**
- **Tailwind CSS 4** com tema preto / laranja / branco
- **Prisma 6** + **SQLite** (um banco por instalação)
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
