"use client";

import { useActionState } from "react";
import { resetPassword } from "@/app/actions/auth";
import { AuthShell } from "@/components/admin/AuthShell";
import { Alert, Field, SubmitButton, inputClass } from "@/components/admin/Field";

export function ResetForm({ token, storeName }: { token: string; storeName?: string }) {
  const [state, formAction, pending] = useActionState(resetPassword, {});

  return (
    <AuthShell
      title="Nova senha"
      subtitle="Escolha uma senha de pelo menos 8 caracteres"
      storeName={storeName}
    >
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="token" value={token} />
        {state.error && <Alert tone="error">{state.error}</Alert>}

        <Field label="Nova senha">
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className={inputClass}
          />
        </Field>

        <Field label="Repita a nova senha">
          <input
            name="confirm"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className={inputClass}
          />
        </Field>

        <SubmitButton pending={pending}>Salvar nova senha</SubmitButton>
      </form>
    </AuthShell>
  );
}
