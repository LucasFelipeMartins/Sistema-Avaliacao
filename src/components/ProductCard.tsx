"use client";

import { formatPrice } from "@/lib/format";
import type { MenuProduct } from "@/lib/menu";
import { ProductImage } from "@/components/ProductImage";
import { ScoreBadge } from "@/components/ScoreBadge";

type Props = {
  product: MenuProduct;
  onSelect: (product: MenuProduct) => void;
  index?: number;
};

/** Linha do cardápio: foto à esquerda, nome em destaque, ingredientes, preço e nota. */
export function ProductRow({ product, onSelect, index = 0 }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
      className="group card animate-rise flex w-full items-stretch gap-3 rounded-2xl p-3 text-left transition active:scale-[0.985] active:border-flame/40"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-2">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          sizes="96px"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="display line-clamp-1 text-lg text-cream">{product.name}</h3>
            <ScoreBadge average={product.average} count={product.reviewCount} />
          </div>
          <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted">
            {product.ingredients}
          </p>
        </div>

        <div className="mt-2 flex items-end justify-between gap-2">
          <span className="display text-xl text-flame">{formatPrice(product.priceCents)}</span>
          <span className="text-[11px] font-medium text-faint group-active:text-flame">
            ver e avaliar →
          </span>
        </div>
      </div>
    </button>
  );
}

/** Cartão vertical usado no carrossel de "Mais pedidos". */
export function ProductTile({ product, onSelect, index = 0 }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
      className="group card animate-rise w-44 shrink-0 overflow-hidden rounded-2xl text-left transition active:scale-[0.97]"
    >
      <div className="relative h-28 w-full overflow-hidden bg-surface-2">
        <ProductImage src={product.imageUrl} alt={product.name} sizes="176px" />
        <div className="absolute top-2 right-2">
          <ScoreBadge average={product.average} count={product.reviewCount} />
        </div>
      </div>
      <div className="p-3">
        <h3 className="display line-clamp-1 text-base text-cream">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-muted">
          {product.ingredients}
        </p>
        <p className="display mt-2 text-lg text-flame">{formatPrice(product.priceCents)}</p>
      </div>
    </button>
  );
}
