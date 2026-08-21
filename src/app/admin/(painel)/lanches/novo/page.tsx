import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-5">
      <h2 className="display text-2xl text-cream">Novo lanche</h2>
      <ProductForm categories={categories} />
    </div>
  );
}
