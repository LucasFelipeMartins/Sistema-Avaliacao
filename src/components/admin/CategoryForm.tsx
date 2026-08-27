"use client";

import { useActionState } from "react";
import { saveCategory } from "@/app/actions/admin";
import { Icon } from "@/components/Icon";

type Category = { id: string; name: string };

const field =
  "min-w-0 flex-1 rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-cream placeholder:text-faint focus:border-flame focus:outline-none";

/** Cria uma categoria nova ou renomeia uma existente (mesmo formulário). */
export function CategoryForm({ category }: { category?: Category }) {
  const [state, formAction, pending] = useActionState(saveCategory, {});
  const editing = Boolean(category);

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      {category && <input type="hidden" name="id" value={category.id} />}

      <input
        name="name"
        required
        defaultValue={category?.name ?? ""}
        placeholder="Nome da categoria"
        aria-label="Nome da categoria"
        className={field}
      />
      <button
        type="submit"
        disabled={pending}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold transition disabled:opacity-50 ${
          editing ? "border border-line bg-surface-2 text-cream" : "bg-flame text-ink"
        }`}
      >
        {!editing && <Icon name="plus" className="h-4 w-4" />}
        {pending ? "..." : editing ? "Salvar" : "Criar"}
      </button>

      {state.error && <p className="w-full text-xs text-score-low">{state.error}</p>}
      {state.success && !editing && (
        <p className="w-full text-xs text-score-high">{state.success}</p>
      )}
    </form>
  );
}
