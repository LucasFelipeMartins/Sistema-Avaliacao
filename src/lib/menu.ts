import "server-only";
import { prisma } from "@/lib/prisma";

// Seções que não vêm de uma Category do banco: o carrossel de destaques e a
// sobra de lanches sem categoria. Ids em texto para conviverem com os ObjectId.
export const FEATURED_ID = "destaques";
export const UNCATEGORIZED_ID = "outros";

export type MenuProduct = {
  id: string;
  name: string;
  ingredients: string;
  priceCents: number;
  imageUrl: string | null;
  featured: boolean;
  categoryId: string | null;
  average: number | null;
  reviewCount: number;
};

export type MenuCategory = {
  id: string;
  name: string;
  featured: boolean;
  products: MenuProduct[];
};

/** Média e total de notas por lanche, em uma consulta só. */
export async function getRatings() {
  const rows = await prisma.review.groupBy({
    by: ["productId"],
    _avg: { rating: true },
    _count: { _all: true },
  });

  return new Map(
    rows.map((row) => [
      row.productId,
      { average: row._avg.rating ?? 0, count: row._count._all },
    ]),
  );
}

/** Cardápio público: apenas lanches disponíveis, agrupados por categoria. */
export async function getMenu(): Promise<MenuCategory[]> {
  const [categories, products, ratings] = await Promise.all([
    prisma.category.findMany({ orderBy: [{ position: "asc" }, { name: "asc" }] }),
    prisma.product.findMany({
      where: { available: true },
      orderBy: [{ position: "asc" }, { name: "asc" }],
    }),
    getRatings(),
  ]);

  const decorate = (product: (typeof products)[number]): MenuProduct => {
    const rating = ratings.get(product.id);
    return {
      id: product.id,
      name: product.name,
      ingredients: product.ingredients,
      priceCents: product.priceCents,
      imageUrl: product.imageUrl,
      featured: product.featured,
      categoryId: product.categoryId,
      average: rating && rating.count > 0 ? rating.average : null,
      reviewCount: rating?.count ?? 0,
    };
  };

  const menu: MenuCategory[] = [];

  // "Mais pedidos" é uma vitrine: reúne os destaques marcados no painel.
  const featured = products.filter((product) => product.featured).map(decorate);
  if (featured.length > 0) {
    menu.push({ id: FEATURED_ID, name: "Mais pedidos", featured: true, products: featured });
  }

  for (const category of categories) {
    const items = products.filter((product) => product.categoryId === category.id);
    if (items.length === 0) continue;
    menu.push({
      id: category.id,
      name: category.name,
      featured: false,
      products: items.map(decorate),
    });
  }

  const uncategorized = products.filter((product) => product.categoryId === null);
  if (uncategorized.length > 0) {
    menu.push({
      id: UNCATEGORIZED_ID,
      name: "Outros",
      featured: false,
      products: uncategorized.map(decorate),
    });
  }

  return menu;
}
