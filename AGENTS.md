<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Cardápio Digital — notas do projeto

Cardápio por QR Code com avaliações de 0 a 10, para hamburguerias.
**Uma instalação por estabelecimento** — banco SQLite próprio, senha própria, sem multi-tenant.
Nunca introduza `storeId` nas consultas: existe uma única `Store` (id = 1).

## Comandos

- `npm run dev` — sobe o app
- `npm run db:push` — aplica o schema no SQLite
- `npm run db:seed` — cria a loja, o acesso do painel e o cardápio de exemplo
- `npm run build` / `npm run lint`

## Convenções

- **Preços em centavos** (`priceCents: Int`). Use `formatPrice` / `parsePriceToCents` de `src/lib/format.ts`; nunca faça conta com float de reais.
- **Médias não são desnormalizadas**: a nota vem de `getRatings()` (`src/lib/menu.ts`), que agrega `Review` em uma consulta. Não crie campos `ratingSum`/`ratingCount`.
- **Mutação = server action** em `src/app/actions/`. Toda ação do painel começa com `await requireSession()`.
- Páginas do painel ficam em `src/app/admin/(painel)/` — o layout desse grupo já exige sessão. `login`, `esqueci-senha` e `redefinir-senha` ficam fora dele, sem autenticação.
- Sem middleware de auth: a proteção é o layout do grupo `(painel)` (Prisma não roda no edge runtime).
- Após mudar dados do cardápio, chame `revalidatePath("/")` — a página pública é `force-dynamic`, mas o painel também lê essas rotas.
- **Um voto por aparelho por lanche**: `@@unique([productId, deviceId])` + `upsert`. O `deviceId` é um UUID no `localStorage` (`src/lib/device.ts`), não há login de cliente.
- Uploads vão para `public/uploads/` via `src/lib/upload.ts`, que também apaga o arquivo antigo ao trocar a foto.

## Interface

- Texto de interface **em português do Brasil**, na linguagem do dono de lanchonete — evite jargão técnico.
- Ícones: só `src/components/Icon.tsx` (SVG em traço, `currentColor`). **Nunca use emoji na interface** — passa impressão de sistema amador.
- Tema no `@theme` de `src/app/globals.css`: `ink`/`surface` (preto), `flame`/`ember` (laranja), `cream` (branco), `score-high|mid|low` (notas). Use os tokens, não hex solto.
- Títulos usam a utilidade `display` (fonte Anton, caixa alta). Corpo em Inter.
- **Mobile-first**: o cardápio é usado no celular, na mesa. Alvos de toque grandes, nada essencial fora do alcance do polegar.
