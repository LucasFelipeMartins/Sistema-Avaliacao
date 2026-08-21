const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** 2590 -> "R$ 25,90" */
export function formatPrice(cents: number) {
  return brl.format(cents / 100);
}

/** "25,90" ou "25.90" -> 2590 */
export function parsePriceToCents(input: string) {
  const cleaned = input.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const value = Number.parseFloat(cleaned);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}

/** 8.6666 -> "8.7" (nota de 0 a 10 com uma casa) */
export function formatRating(average: number) {
  return average.toFixed(1).replace(".", ",");
}

/** Cor da nota: verde (ótimo), laranja (bom), vermelho (fraco). */
export function ratingTone(average: number): "high" | "mid" | "low" {
  if (average >= 8) return "high";
  if (average >= 6) return "mid";
  return "low";
}
