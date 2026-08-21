"use client";

import { useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { submitReview } from "@/app/actions/reviews";
import { getDeviceId, getMyRatings, saveMyRating } from "@/lib/device";
import { formatPrice, formatRating } from "@/lib/format";
import type { MenuProduct } from "@/lib/menu";
import { ProductImage } from "@/components/ProductImage";
import { RatingPicker } from "@/components/RatingPicker";
import { ScoreBadge } from "@/components/ScoreBadge";

type Props = {
  product: MenuProduct | null;
  onClose: () => void;
};

/** Detalhe do lanche + avaliação, em folha deslizante (bottom sheet). */
export function ProductSheet({ product, onClose }: Props) {
  // Trava o scroll do fundo e fecha no Esc enquanto a folha está aberta.
  useEffect(() => {
    if (!product) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          {/* a key reinicia o formulário quando o cliente abre outro lanche */}
          <Sheet key={product.id} product={product} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Sheet({ product, onClose }: { product: MenuProduct; onClose: () => void }) {
  const [rating, setRating] = useState<number | null>(() => {
    const mine = getMyRatings()[String(product.id)];
    return typeof mine === "number" ? mine : null;
  });
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<{ average: number; count: number } | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit() {
    if (rating === null) return;
    setError(null);
    startTransition(async () => {
      const result = await submitReview({
        productId: product.id,
        rating,
        comment,
        deviceId: getDeviceId(),
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      saveMyRating(product.id, rating);
      setSaved({ average: result.average, count: result.count });
    });
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
      className="safe-bottom relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border-t border-line bg-ink sm:mb-6 sm:rounded-3xl sm:border"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 32, stiffness: 320 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.4 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 120 || info.velocity.y > 700) onClose();
      }}
    >
      <div className="relative h-56 w-full overflow-hidden rounded-t-3xl">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          sizes="(max-width: 640px) 100vw, 32rem"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/30 to-transparent" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/70 text-lg text-cream backdrop-blur active:scale-90"
        >
          <Icon name="x" className="h-5 w-5" />
        </button>
        <div className="absolute top-3 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-cream/40 sm:hidden" />
      </div>

      <div className="px-5 pb-6">
        <div className="relative z-10 -mt-6 flex items-start justify-between gap-3">
          <h2 className="display text-3xl text-cream">{product.name}</h2>
          <ScoreBadge
            average={saved ? saved.average : product.average}
            count={saved ? saved.count : product.reviewCount}
            size="lg"
          />
        </div>

        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          {product.ingredients || "Sem descrição cadastrada."}
        </p>

        <p className="display mt-4 text-3xl text-flame">{formatPrice(product.priceCents)}</p>

        <div className="mt-6 rounded-2xl border border-line bg-surface/60 p-4">
          {saved ? (
            <div className="animate-pop py-2 text-center">
              <Icon name="check" className="mx-auto h-9 w-9 text-score-high" />
              <p className="mt-2 font-semibold text-cream">Valeu pela avaliação!</p>
              <p className="mt-1 text-sm text-muted">
                A nota do {product.name} agora é{" "}
                <strong className="text-flame">{formatRating(saved.average)}</strong> com{" "}
                {saved.count} {saved.count === 1 ? "voto" : "votos"}.
              </p>
              <button
                type="button"
                onClick={() => setSaved(null)}
                className="mt-3 text-sm font-semibold text-flame underline underline-offset-4"
              >
                Mudar minha nota
              </button>
            </div>
          ) : (
            <>
              <p className="mb-3 text-center text-sm font-semibold text-cream">
                Já provou? Dê sua nota de 0 a 10
              </p>

              <RatingPicker value={rating} onChange={setRating} disabled={pending} />

              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                maxLength={280}
                rows={2}
                placeholder="Quer comentar? (opcional)"
                className="mt-4 w-full resize-none rounded-xl border border-line bg-surface-2 px-3 py-2.5 text-sm text-cream placeholder:text-faint focus:border-flame focus:outline-none"
              />

              {error && <p className="mt-2 text-sm text-score-low">{error}</p>}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={rating === null || pending}
                className="mt-3 w-full rounded-xl bg-flame py-3.5 font-bold text-ink transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-faint"
              >
                {pending ? "Enviando..." : "Enviar avaliação"}
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
