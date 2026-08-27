import "server-only";
import { prisma } from "@/lib/prisma";

/**
 * _id fixo da loja. Existe uma única linha nesta instalação, então o id é uma
 * constante em vez de um ObjectId gerado — mantém o `findUnique` direto.
 * O mesmo valor está em prisma/seed.ts, que cria a linha.
 */
export const STORE_ID = "loja";

/** Sempre existe uma única loja nesta instalação. */
export async function getStore() {
  return prisma.store.findUnique({ where: { id: STORE_ID } });
}

export async function requireStore() {
  const store = await getStore();
  if (!store) {
    throw new Error(
      "Estabelecimento ainda não configurado. Rode `npm run db:seed` para criar o acesso inicial.",
    );
  }
  return store;
}

export function appUrl() {
  return (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
}
