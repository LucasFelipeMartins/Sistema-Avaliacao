import { notFound } from "next/navigation";
import { isId, prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isId(id)) notFound();

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: [{ position: "asc" }, { name: "asc" }] }),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-5">
      <h2 className="display text-2xl text-cream">Editar lanche</h2>
      <ProductForm
        categories={categories}
        product={{
          id: product.id,
          name: product.name,
          ingredients: product.ingredients,
          priceCents: product.priceCents,
          imageUrl: product.imageUrl,
          categoryId: product.categoryId,
          available: product.available,
          featured: product.featured,
        }}
      />
    </div>
  );
}
