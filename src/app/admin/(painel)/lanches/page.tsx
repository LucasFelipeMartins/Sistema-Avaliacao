import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getRatings } from "@/lib/menu";
import { Icon } from "@/components/Icon";
import { Alert } from "@/components/admin/Field";
import { ProductAdminCard } from "@/components/admin/ProductAdminCard";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ salvo?: string }>;
}) {
  const [{ salvo }, categories, products, ratings] = await Promise.all([
    searchParams,
    prisma.category.findMany({ orderBy: [{ position: "asc" }, { name: "asc" }] }),
    prisma.product.findMany({ orderBy: [{ position: "asc" }, { name: "asc" }] }),
    getRatings(),
  ]);

  const groups = [
    ...categories.map((category) => ({
      key: String(category.id),
      title: category.name,
      items: products.filter((product) => product.categoryId === category.id),
    })),
    {
      key: "sem-categoria",
      title: "Sem categoria",
      items: products.filter((product) => product.categoryId === null),
    },
  ].filter((group) => group.items.length > 0);

  return (
    <div className="space-y-5">
      {salvo === "1" && <Alert tone="success">Lanche salvo com sucesso.</Alert>}

      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="display text-2xl text-cream">Lanches</h2>
          <p className="text-sm text-muted">{products.length} cadastrados</p>
        </div>
        <Link
          href="/admin/lanches/novo"
          className="glow inline-flex shrink-0 items-center gap-1.5 rounded-full bg-flame px-4 py-2.5 text-sm font-bold text-ink"
        >
          <Icon name="plus" className="h-4 w-4" />
          Novo
        </Link>
      </div>

      {products.length === 0 && (
        <p className="card rounded-2xl p-6 text-center text-sm text-muted">
          Nenhum lanche cadastrado ainda. Comece pelo botão <strong>Novo</strong>.
        </p>
      )}

      {groups.map((group) => (
        <section key={group.key}>
          <h3 className="mb-2 text-sm font-semibold tracking-wide text-faint uppercase">
            {group.title}
          </h3>
          <ul className="space-y-2">
            {group.items.map((product) => (
              <ProductAdminCard
                key={product.id}
                product={product}
                stats={ratings.get(product.id)}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
