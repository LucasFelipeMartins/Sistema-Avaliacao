import { prisma } from "@/lib/prisma";
import { deleteCategory, moveCategory } from "@/app/actions/admin";
import { Icon } from "@/components/Icon";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export const dynamic = "force-dynamic";

const icon =
  "flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface-2 text-muted transition hover:border-flame/50 hover:text-flame";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ position: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="display text-2xl text-cream">Categorias</h2>
        <p className="text-sm text-muted">
          Definem as seções e a ordem do cardápio (Hambúrgueres, Porções, Bebidas...).
        </p>
      </div>

      <div className="card rounded-2xl p-4">
        <p className="mb-3 text-sm font-semibold text-cream">Nova categoria</p>
        <CategoryForm />
      </div>

      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id} className="card space-y-3 rounded-2xl p-3">
            <CategoryForm category={category} />

            <div className="flex items-center justify-between gap-2 border-t border-line/60 pt-2">
              <p className="text-xs text-faint">
                {category._count.products}{" "}
                {category._count.products === 1 ? "lanche" : "lanches"} nesta categoria
              </p>

              <div className="flex items-center gap-1.5">
                <form action={moveCategory}>
                  <input type="hidden" name="id" value={category.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button type="submit" className={icon} title="Subir">
                    <Icon name="arrowUp" className="h-4 w-4" />
                  </button>
                </form>
                <form action={moveCategory}>
                  <input type="hidden" name="id" value={category.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button type="submit" className={icon} title="Descer">
                    <Icon name="arrowDown" className="h-4 w-4" />
                  </button>
                </form>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={category.id} />
                  <ConfirmButton
                    message={`Apagar a categoria "${category.name}"? Os ${category._count.products} lanches dela ficam sem categoria (não são apagados).`}
                    title="Apagar categoria"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface-2 text-muted transition hover:border-score-low/50 hover:text-score-low"
                  >
                    <Icon name="trash" className="h-4 w-4" />
                  </ConfirmButton>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {categories.length === 0 && (
        <p className="card rounded-2xl p-6 text-center text-sm text-muted">
          Nenhuma categoria ainda. Crie a primeira acima.
        </p>
      )}
    </div>
  );
}
