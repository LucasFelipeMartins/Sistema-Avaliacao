import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getRatings } from "@/lib/menu";
import { formatPrice, formatRating } from "@/lib/format";
import { Icon } from "@/components/Icon";
import { ScoreBadge } from "@/components/ScoreBadge";

export const dynamic = "force-dynamic";

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="card rounded-2xl p-4">
      <p className="text-xs font-semibold tracking-wide text-faint uppercase">{label}</p>
      <p className="display mt-1.5 text-3xl text-cream">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export default async function DashboardPage() {
  const [products, reviewCount, average, ratings, latest] = await Promise.all([
    prisma.product.findMany({ orderBy: { name: "asc" } }),
    prisma.review.count(),
    prisma.review.aggregate({ _avg: { rating: true } }),
    getRatings(),
    prisma.review.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { product: { select: { name: true } } },
    }),
  ]);

  const active = products.filter((product) => product.available);
  const menuAverage = average._avg.rating;

  const ranked = products
    .map((product) => ({ product, stats: ratings.get(product.id) }))
    .filter((row) => (row.stats?.count ?? 0) > 0)
    .sort((a, b) => (b.stats!.average ?? 0) - (a.stats!.average ?? 0));

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-3">
        <Stat
          label="Lanches"
          value={String(products.length)}
          hint={`${active.length} no ar · ${products.length - active.length} ocultos`}
        />
        <Stat
          label="Avaliações"
          value={String(reviewCount)}
          hint={reviewCount === 0 ? "ninguém avaliou ainda" : "notas de 0 a 10"}
        />
        <Stat
          label="Nota da casa"
          value={menuAverage ? formatRating(menuAverage) : "—"}
          hint="média geral do cardápio"
        />
        <Stat
          label="Ticket médio"
          value={
            active.length
              ? formatPrice(
                  Math.round(
                    active.reduce((sum, product) => sum + product.priceCents, 0) / active.length,
                  ),
                )
              : "—"
          }
          hint="preço médio dos itens no ar"
        />
      </section>

      <section className="flex gap-3">
        <Link
          href="/admin/lanches/novo"
          className="glow flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-flame py-3.5 text-center font-bold text-ink transition active:scale-[0.98]"
        >
          <Icon name="plus" className="h-5 w-5" />
          Novo lanche
        </Link>
        <Link
          href="/admin/qrcode"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-line bg-surface py-3.5 text-center font-bold text-cream transition active:scale-[0.98]"
        >
          <Icon name="qr" className="h-5 w-5" />
          Imprimir QR Code
        </Link>
      </section>

      <section>
        <h2 className="display mb-3 flex items-center gap-2 text-xl text-cream">
          <Icon name="trophy" className="h-5 w-5 text-flame" />
          Melhores avaliados
        </h2>
        {ranked.length === 0 ? (
          <p className="card rounded-2xl p-5 text-sm text-muted">
            Assim que os clientes começarem a dar notas, o ranking aparece aqui.
          </p>
        ) : (
          <ol className="space-y-2">
            {ranked.slice(0, 5).map((row, index) => (
              <li
                key={row.product.id}
                className="card flex items-center gap-3 rounded-xl px-4 py-3"
              >
                <span className="display w-6 text-lg text-flame tabular-nums">{index + 1}</span>
                <span className="flex-1 truncate font-semibold text-cream">{row.product.name}</span>
                <ScoreBadge average={row.stats!.average} count={row.stats!.count} />
              </li>
            ))}
          </ol>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="display flex items-center gap-2 text-xl text-cream">
            <Icon name="chat" className="h-5 w-5 text-flame" />
            Últimas avaliações
          </h2>
          <Link href="/admin/avaliacoes" className="text-sm text-flame hover:underline">
            ver todas
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className="card rounded-2xl p-5 text-sm text-muted">Nenhuma avaliação ainda.</p>
        ) : (
          <ul className="space-y-2">
            {latest.map((review) => (
              <li key={review.id} className="card rounded-xl px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate font-semibold text-cream">{review.product.name}</span>
                  <span className="display shrink-0 text-lg text-flame">{review.rating}</span>
                </div>
                {review.comment && (
                  <p className="mt-1 text-sm text-muted">“{review.comment}”</p>
                )}
                <p className="mt-1 text-xs text-faint">
                  {review.createdAt.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
