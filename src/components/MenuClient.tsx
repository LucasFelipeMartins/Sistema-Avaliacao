"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MenuCategory, MenuProduct } from "@/lib/menu";
import { Icon } from "@/components/Icon";
import { ProductRow, ProductTile } from "@/components/ProductCard";
import { ProductSheet } from "@/components/ProductSheet";

const normalize = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function MenuClient({ menu }: { menu: MenuCategory[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MenuProduct | null>(null);
  const [activeId, setActiveId] = useState<string | null>(menu[0]?.id ?? null);
  const chipsRef = useRef<HTMLDivElement>(null);

  const searching = query.trim().length > 0;

  const results = useMemo(() => {
    if (!searching) return [];
    const term = normalize(query.trim());
    const seen = new Set<string>();
    const found: MenuProduct[] = [];
    for (const category of menu) {
      for (const product of category.products) {
        if (seen.has(product.id)) continue;
        if (
          normalize(product.name).includes(term) ||
          normalize(product.ingredients).includes(term)
        ) {
          seen.add(product.id);
          found.push(product);
        }
      }
    }
    return found;
  }, [menu, query, searching]);

  // Marca a categoria visível no topo da tela.
  useEffect(() => {
    if (searching) return;
    const sections = menu
      .map((category) => document.getElementById(`cat-${category.id}`))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.getAttribute("data-category"));
      },
      { rootMargin: "-140px 0px -65% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [menu, searching]);

  // Mantém a aba ativa sempre visível na régua de categorias.
  useEffect(() => {
    const chip = chipsRef.current?.querySelector<HTMLElement>(`[data-chip="${activeId}"]`);
    chip?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeId]);

  function goToCategory(id: string) {
    setActiveId(id);
    const section = document.getElementById(`cat-${id}`);
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY - 128;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <>
      <div className="sticky top-0 z-30 border-b border-line/60 bg-ink/85 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-lg px-4 pt-3 pb-2">
          <div className="relative">
            <Icon
              name="search"
              className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar lanche ou ingrediente..."
              aria-label="Buscar no cardápio"
              className="w-full rounded-full border border-line bg-surface py-3 pr-11 pl-10 text-[15px] text-cream placeholder:text-faint focus:border-flame focus:outline-none"
            />
            {searching && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Limpar busca"
                className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted active:text-flame"
              >
                <Icon name="x" className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {!searching && menu.length > 1 && (
          <div
            ref={chipsRef}
            className="no-scrollbar mx-auto flex w-full max-w-lg gap-2 overflow-x-auto px-4 pb-3"
          >
            {menu.map((category) => {
              const active = category.id === activeId;
              return (
                <button
                  key={category.id}
                  data-chip={category.id}
                  type="button"
                  onClick={() => goToCategory(category.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap transition ${
                    active
                      ? "border-flame bg-flame text-ink"
                      : "border-line bg-surface text-muted active:border-flame/50"
                  }`}
                >
                  {category.featured && <Icon name="flame" filled className="h-3.5 w-3.5" />}
                  {category.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mx-auto w-full max-w-lg px-4 pt-5 pb-24">
        {searching ? (
          results.length > 0 ? (
            <section>
              <h2 className="display mb-3 text-xl text-cream">
                {results.length} {results.length === 1 ? "resultado" : "resultados"}
              </h2>
              <div className="flex flex-col gap-3">
                {results.map((product, index) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onSelect={setSelected}
                    index={index}
                  />
                ))}
              </div>
            </section>
          ) : (
            <p className="py-20 text-center text-muted">
              Nada encontrado para <strong className="text-cream">“{query}”</strong>.
            </p>
          )
        ) : (
          menu.map((category) => (
            <section
              key={category.id}
              id={`cat-${category.id}`}
              data-category={category.id}
              className="mb-9 scroll-mt-32"
            >
              <div className="mb-3 flex items-center gap-2">
                {category.featured && (
                  <Icon name="flame" filled className="animate-sizzle h-5 w-5 text-flame" />
                )}
                <h2 className="display text-xl text-cream">{category.name}</h2>
                <span className="text-xs text-faint">{category.products.length} itens</span>
              </div>

              {category.featured ? (
                <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
                  {category.products.map((product, index) => (
                    <ProductTile
                      key={product.id}
                      product={product}
                      onSelect={setSelected}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {category.products.map((product, index) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      onSelect={setSelected}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </section>
          ))
        )}
      </div>

      <ProductSheet product={selected} onClose={() => setSelected(null)} />
    </>
  );
}
