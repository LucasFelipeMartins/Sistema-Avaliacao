"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { saveProduct } from "@/app/actions/admin";
import { Icon } from "@/components/Icon";
import { Alert, Field, SubmitButton, inputClass } from "@/components/admin/Field";

type Category = { id: number; name: string };

type ProductInput = {
  id: number;
  name: string;
  ingredients: string;
  priceCents: number;
  imageUrl: string | null;
  categoryId: number | null;
  available: boolean;
  featured: boolean;
};

type Props = { categories: Category[]; product?: ProductInput };

const centsToInput = (cents: number) => (cents / 100).toFixed(2).replace(".", ",");

export function ProductForm({ categories, product }: Props) {
  const [state, formAction, pending] = useActionState(saveProduct, {});
  const [preview, setPreview] = useState<string | null>(product?.imageUrl ?? null);
  const [removeImage, setRemoveImage] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="removeImage" value={removeImage ? "1" : "0"} />

      {state.error && <Alert tone="error">{state.error}</Alert>}

      <div className="card space-y-4 rounded-2xl p-4">
        <Field label="Nome do lanche">
          <input
            name="name"
            required
            defaultValue={product?.name}
            placeholder="Ex.: Smash Clássico"
            className={inputClass}
          />
        </Field>

        <Field
          label="Ingredientes"
          hint="Aparecem embaixo do nome, no cardápio. Separe por vírgula."
        >
          <textarea
            name="ingredients"
            rows={3}
            defaultValue={product?.ingredients}
            placeholder="2 blends de 90g, cheddar, cebola caramelizada, pão brioche"
            className={`${inputClass} resize-none`}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Preço (R$)">
            <input
              name="price"
              required
              inputMode="decimal"
              defaultValue={product ? centsToInput(product.priceCents) : ""}
              placeholder="28,90"
              className={inputClass}
            />
          </Field>

          <Field label="Categoria">
            <select
              name="categoryId"
              defaultValue={product?.categoryId ?? ""}
              className={inputClass}
            >
              <option value="">Sem categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      <div className="card space-y-3 rounded-2xl p-4">
        <p className="text-sm font-semibold text-cream">Foto do lanche</p>

        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-line bg-surface-2">
            {preview ? (
              <Image src={preview} alt="Prévia" fill sizes="96px" className="object-cover" unoptimized />
            ) : (
              <span className="flex h-full w-full items-center justify-center">
                <Icon name="image" className="h-6 w-6 text-line" strokeWidth={1.5} />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  setPreview(URL.createObjectURL(file));
                  setRemoveImage(false);
                }
              }}
              className="block w-full text-xs text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-flame file:px-3 file:py-2 file:text-xs file:font-bold file:text-ink"
            />
            {preview && (
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setRemoveImage(true);
                }}
                className="text-xs font-semibold text-score-low underline underline-offset-4"
              >
                remover foto
              </button>
            )}
            <p className="text-xs text-faint">JPG, PNG ou WEBP até 6 MB.</p>
          </div>
        </div>

        <Field label="Ou cole o link de uma foto" hint="Use se a imagem já estiver hospedada na internet.">
          <input
            name="imageUrl"
            defaultValue={product?.imageUrl?.startsWith("http") ? product.imageUrl : ""}
            placeholder="https://..."
            className={inputClass}
          />
        </Field>
      </div>

      <div className="card space-y-3 rounded-2xl p-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="available"
            defaultChecked={product?.available ?? true}
            className="h-5 w-5 accent-[var(--color-flame)]"
          />
          <span className="text-sm text-cream">
            Mostrar no cardápio
            <span className="block text-xs text-faint">Desmarque para esconder sem apagar.</span>
          </span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product?.featured ?? false}
            className="h-5 w-5 accent-[var(--color-flame)]"
          />
          <span className="text-sm text-cream">
            Destacar em “Mais pedidos”
            <span className="block text-xs text-faint">Aparece no carrossel do topo.</span>
          </span>
        </label>
      </div>

      <div className="flex gap-3">
        <Link
          href="/admin/lanches"
          className="flex-1 rounded-xl border border-line bg-surface py-3.5 text-center font-semibold text-muted"
        >
          Cancelar
        </Link>
        <div className="flex-1">
          <SubmitButton pending={pending}>{product ? "Salvar" : "Cadastrar"}</SubmitButton>
        </div>
      </div>
    </form>
  );
}
