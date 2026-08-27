import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Os ids do Mongo são ObjectId (24 caracteres hexadecimais). Consultar com um
 * id fora desse formato derruba o Prisma, então tudo que vem da URL ou de um
 * formulário passa por aqui antes de virar consulta.
 */
export function isId(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{24}$/i.test(value);
}
