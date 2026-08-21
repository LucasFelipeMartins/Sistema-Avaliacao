import Image from "next/image";
import Link from "next/link";
import type { Product } from "@prisma/client";
import { formatPrice } from "@/lib/format";
import {
  deleteProduct,
  moveProduct,
  toggleAvailability,
  toggleFeatured,
} from "@/app/actions/admin";
import { Icon } from "@/components/Icon";
import { ScoreBadge } from "@/components/ScoreBadge";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

const chip =
  "inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-3 py-1.5 text-xs font-semibold text-cream transition hover:border-flame/50";
const icon =
  "flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface-2 text-muted transition hover:border-flame/50 hover:text-flame";

type Props = {
  product: Product;
  stats?: { average: number; count: number };
};

/** Cartão de um lanche na listagem do painel, com todas as ações rápidas. */
export function ProductAdminCard({ product, stats }: Props) {
  return (
    <li className={`card rounded-2xl p-3 ${product.available ? "" : "opacity-55"}`}>
      <div className="flex gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-2">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center">
              <Icon name="image" className="h-5 w-5 text-line" strokeWidth={1.5} />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="flex min-w-0 items-center gap-1.5 font-bold text-cream">
              {product.featured && (
                <Icon name="flame" filled className="h-3.5 w-3.5 text-flame" />
              )}
              <span className="truncate">{product.name}</span>
            </p>
            <ScoreBadge
              average={stats && stats.count > 0 ? stats.average : null}
              count={stats?.count ?? 0}
            />
          </div>
          <p className="line-clamp-1 text-xs text-muted">{product.ingredients}</p>
          <p className="display mt-1 text-lg text-flame">
            {formatPrice(product.priceCents)}
            {!product.available && (
              <span className="ml-2 align-middle text-xs font-normal text-score-low">
                oculto no cardápio
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-line/60 pt-3">
        <Link href={`/admin/lanches/${product.id}`} className={chip}>
          <Icon name="pencil" className="h-3.5 w-3.5" />
          Editar
        </Link>

        <form action={toggleAvailability}>
          <input type="hidden" name="id" value={product.id} />
          <button type="submit" className={chip}>
            <Icon name={product.available ? "eyeOff" : "eye"} className="h-3.5 w-3.5" />
            {product.available ? "Ocultar" : "Mostrar"}
          </button>
        </form>

        <form action={toggleFeatured}>
          <input type="hidden" name="id" value={product.id} />
          <button type="submit" className={chip}>
            <Icon name="flame" className="h-3.5 w-3.5" />
            {product.featured ? "Tirar destaque" : "Destacar"}
          </button>
        </form>

        <div className="ml-auto flex items-center gap-1.5">
          <form action={moveProduct}>
            <input type="hidden" name="id" value={product.id} />
            <input type="hidden" name="direction" value="up" />
            <button type="submit" className={icon} title="Subir">
              <Icon name="arrowUp" className="h-4 w-4" />
            </button>
          </form>
          <form action={moveProduct}>
            <input type="hidden" name="id" value={product.id} />
            <input type="hidden" name="direction" value="down" />
            <button type="submit" className={icon} title="Descer">
              <Icon name="arrowDown" className="h-4 w-4" />
            </button>
          </form>
          <form action={deleteProduct}>
            <input type="hidden" name="id" value={product.id} />
            <ConfirmButton
              message={`Apagar "${product.name}"? As avaliações dele também somem.`}
              title="Apagar"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface-2 text-muted transition hover:border-score-low/50 hover:text-score-low"
            >
              <Icon name="trash" className="h-4 w-4" />
            </ConfirmButton>
          </form>
        </div>
      </div>
    </li>
  );
}
