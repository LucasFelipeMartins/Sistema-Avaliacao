"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { saveStore } from "@/app/actions/admin";
import { Icon } from "@/components/Icon";
import { Alert, Field, SubmitButton, inputClass } from "@/components/admin/Field";

export type StoreInput = {
  name: string;
  tagline: string;
  logoUrl: string | null;
  whatsapp: string | null;
  instagram: string | null;
  address: string | null;
  openingHours: string | null;
  publicUrl: string | null;
  adminEmail: string;
};

export function StoreForm({ store }: { store: StoreInput }) {
  const [state, formAction, pending] = useActionState(saveStore, {});
  const [preview, setPreview] = useState<string | null>(store.logoUrl);
  const [removeLogo, setRemoveLogo] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="removeLogo" value={removeLogo ? "1" : "0"} />

      {state.error && <Alert tone="error">{state.error}</Alert>}
      {state.success && <Alert tone="success">{state.success}</Alert>}

      <div className="card space-y-4 rounded-2xl p-4">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-line bg-surface-2">
            {preview ? (
              <Image src={preview} alt="Logo" fill sizes="80px" className="object-cover" unoptimized />
            ) : (
              <span className="flex h-full w-full items-center justify-center">
                <Icon name="image" className="h-6 w-6 text-line" strokeWidth={1.5} />
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-sm font-semibold text-cream">Logo do estabelecimento</p>
            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  setPreview(URL.createObjectURL(file));
                  setRemoveLogo(false);
                }
              }}
              className="block w-full text-xs text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-flame file:px-3 file:py-2 file:text-xs file:font-bold file:text-ink"
            />
            {preview && (
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setRemoveLogo(true);
                }}
                className="text-xs font-semibold text-score-low underline underline-offset-4"
              >
                remover logo
              </button>
            )}
          </div>
        </div>

        <Field label="Nome do estabelecimento">
          <input name="name" required defaultValue={store.name} className={inputClass} />
        </Field>

        <Field label="Frase de efeito" hint="Aparece logo abaixo do nome, no topo do cardápio.">
          <input
            name="tagline"
            defaultValue={store.tagline}
            placeholder="Artesanal, na brasa, do jeito que você gosta"
            className={inputClass}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="WhatsApp">
            <input
              name="whatsapp"
              defaultValue={store.whatsapp ?? ""}
              placeholder="(00) 00000-0000"
              className={inputClass}
            />
          </Field>
          <Field label="Instagram">
            <input
              name="instagram"
              defaultValue={store.instagram ?? ""}
              placeholder="@suahamburgueria"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Horário de funcionamento">
          <input
            name="openingHours"
            defaultValue={store.openingHours ?? ""}
            placeholder="Ter a Dom, 18h às 23h30"
            className={inputClass}
          />
        </Field>

        <Field label="Endereço">
          <input
            name="address"
            defaultValue={store.address ?? ""}
            placeholder="Rua das Brasas, 123 — Centro"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="card space-y-4 rounded-2xl p-4">
        <Field
          label="E-mail de acesso"
          hint="É o login do painel e o endereço que recebe o link de recuperação de senha."
        >
          <input
            name="adminEmail"
            type="email"
            required
            defaultValue={store.adminEmail}
            className={inputClass}
          />
        </Field>

        <Field
          label="Endereço do cardápio (QR Code)"
          hint="O endereço público onde o sistema está no ar. Ex.: https://cardapio.suahamburgueria.com.br"
        >
          <input
            name="publicUrl"
            defaultValue={store.publicUrl ?? ""}
            placeholder="https://..."
            className={inputClass}
          />
        </Field>
      </div>

      <SubmitButton pending={pending}>Salvar alterações</SubmitButton>
    </form>
  );
}
