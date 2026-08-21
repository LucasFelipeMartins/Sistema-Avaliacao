import "server-only";
import { prisma } from "@/lib/prisma";

/** Sempre existe uma única loja (id = 1) nesta instalação. */
export async function getStore() {
  return prisma.store.findUnique({ where: { id: 1 } });
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
