import { prisma } from "@/lib/prisma";
import { formatRating, ratingTone } from "@/lib/format";
import { deleteReview } from "@/app/actions/admin";
import { Icon } from "@/components/Icon";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export const dynamic = "force-dynamic";

const TONE = {
  high: "text-score-high",
  mid: "text-score-mid",
  low: "text-score-low",
} as const;

export default async function ReviewsPage() {
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      take: 200,
      orderBy: { createdAt: "desc" },
      include: { product: { select: { name: true } } },
    }),
    prisma.review.aggregate({ _avg: { rating: true }, _count: { _all: true } }),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="display text-2xl text-cream">Avaliações</h2>
        <p className="text-sm text-muted">
          {total._count._all} notas recebidas
          {total._avg.rating !== null && (
            <>
              {" · média geral "}
              <strong className={TONE[ratingTone(total._avg.rating)]}>
                {formatRating(total._avg.rating)}
              </strong>
            </>
          )}
        </p>
      </div>

      {reviews.length === 0 ? (
        <p className="card rounded-2xl p-6 text-center text-sm text-muted">
          Ninguém avaliou ainda. Deixe o QR Code na mesa e as notas começam a chegar.
        </p>
      ) : (
        <ul className="space-y-2">
          {reviews.map((review) => (
            <li key={review.id} className="card flex items-start gap-3 rounded-2xl p-4">
              <span
                className={`display w-10 shrink-0 text-center text-2xl ${
                  TONE[ratingTone(review.rating)]
                }`}
              >
                {review.rating}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-cream">{review.product.name}</p>
                {review.comment ? (
                  <p className="mt-1 text-sm text-muted">“{review.comment}”</p>
                ) : (
                  <p className="mt-1 text-sm text-faint italic">sem comentário</p>
                )}
                <p className="mt-1 text-xs text-faint">
                  {review.createdAt.toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <form action={deleteReview}>
                <input type="hidden" name="id" value={review.id} />
                <ConfirmButton
                  message="Apagar esta avaliação? A média do lanche é recalculada."
                  title="Apagar avaliação"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface-2 text-muted transition hover:border-score-low/50 hover:text-score-low"
                >
                  <Icon name="trash" className="h-4 w-4" />
                </ConfirmButton>
              </form>
            </li>
          ))}
        </ul>
      )}

      {total._count._all > reviews.length && (
        <p className="text-center text-xs text-faint">
          Mostrando as {reviews.length} avaliações mais recentes.
        </p>
      )}
    </div>
  );
}
