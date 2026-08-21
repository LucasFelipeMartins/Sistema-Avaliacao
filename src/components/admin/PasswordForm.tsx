"use client";

import { useActionState } from "react";
import { changePassword } from "@/app/actions/auth";
import { Alert, Field, SubmitButton, inputClass } from "@/components/admin/Field";

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, {});

  return (
    <form action={formAction} className="card space-y-4 rounded-2xl p-4">
      <p className="font-semibold text-cream">Trocar senha</p>

      {state.error && <Alert tone="error">{state.error}</Alert>}
      {state.success && <Alert tone="success">{state.success}</Alert>}

      <Field label="Senha atual">
        <input
          name="current"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>

      <SubmitButton pending={pending}>Trocar senha</SubmitButton>
    </form>
  );
}
