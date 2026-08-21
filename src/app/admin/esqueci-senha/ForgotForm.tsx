"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset } from "@/app/actions/auth";
import { AuthShell } from "@/components/admin/AuthShell";
import { Alert, Field, SubmitButton, inputClass } from "@/components/admin/Field";

export function ForgotForm({ storeName }: { storeName?: string }) {
  const [state, formAction, pending] = useActionState(requestPasswordReset, {});

  return (
    <AuthShell
      title="Recuperar senha"
      subtitle="Enviamos um link para o e-mail cadastrado do estabelecimento"
      storeName={storeName}
      footer={
        <p>
          Lembrou a senha?{" "}
          <Link href="/admin/login" className="text-flame underline-offset-4 hover:underline">
            Voltar ao login
          </Link>
        </p>
      }
    >
      <form action={formAction} className="space-y-4">
        {state.error && <Alert tone="error">{state.error}</Alert>}
        {state.success && <Alert tone="success">{state.success}</Alert>}

        <Field label="E-mail do estabelecimento">
          <input
            name="email"
            type="email"
            required
            autoComplete="username"
            placeholder="dono@hamburgueria.com.br"
            className={inputClass}
          />
        </Field>

        <SubmitButton pending={pending} label="Enviando...">
          Enviar link de recuperação
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
