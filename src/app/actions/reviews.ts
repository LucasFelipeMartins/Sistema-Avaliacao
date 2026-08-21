"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type ReviewResult =
  | { ok: true; average: number; count: number }
  | { ok: false; error: string };

/** Registra (ou atualiza) a nota de 0 a 10 que o cliente deu ao lanche. */
export async function submitReview(input: {
  productId: number;
  rating: number;
  comment?: string;
  deviceId: string;
}): Promise<ReviewResult> {
  const rating = Math.round(Number(input.rating));
  const productId = Number(input.productId);
  const deviceId = String(input.deviceId ?? "").slice(0, 64);
  const comment = input.comment?.trim().slice(0, 280) || null;

  if (!Number.isInteger(rating) || rating < 0 || rating > 10) {
    return { ok: false, error: "A nota precisa ser um número de 0 a 10." };
  }
  if (!deviceId) {
    return { ok: false, error: "Não foi possível identificar seu aparelho." };
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { ok: false, error: "Lanche não encontrado." };

  await prisma.review.upsert({
    where: { productId_deviceId: { productId, deviceId } },
    update: { rating, comment },
    create: { productId, deviceId, rating, comment },
  });

  const stats = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { _all: true },
  });

  revalidatePath("/");

  return {
    ok: true,
    average: stats._avg.rating ?? 0,
    count: stats._count._all,
  };
}
