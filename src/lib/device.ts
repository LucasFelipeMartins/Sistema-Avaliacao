"use client";

const DEVICE_KEY = "hb_device_id";
const RATINGS_KEY = "hb_my_ratings";

/** Identificador anônimo do aparelho: garante 1 voto por lanche, sem login. */
export function getDeviceId() {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

export function getMyRatings(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(RATINGS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function saveMyRating(productId: string, rating: number) {
  const all = getMyRatings();
  all[productId] = rating;
  window.localStorage.setItem(RATINGS_KEY, JSON.stringify(all));
}
