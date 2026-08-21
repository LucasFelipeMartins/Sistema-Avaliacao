"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { AuthShell } from "@/components/admin/AuthShell";
import { Alert, Field, SubmitButton, inputClass } from "@/components/admin/Field";

export function LoginForm({
  storeName,
  justReset,
}: {
  storeName?: string;
  justReset: boolean;
}) {
  const [state, formAction, pending] = useActionState(login, {});

  return (
    <AuthShell
      title="Painel do dono"
      subtitle="Entre para gerenciar o cardápio"
      storeName={storeName}
    >
      <form action={formAction} className="space-y-4">
        {justReset && <Alert tone="success">Senha redefinida! Entre com a nova senha.</Alert>}
        {state.error && <Alert tone="error">{state.error}</Alert>}

        <Field label="E-mail">
          <input
            name="email"
            type="email"
            required
            autoComplete="username"
            placeholder="dono@hamburgueria.com.br"
            className={inputClass}
          />
        </Field>

        <Field label="Senha">
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className={inputClass}
          />
        </Field>

        <SubmitButton pending={pending} label="Entrando...">
          Entrar
        </SubmitButton>

        <p className="text-center text-sm">
          <Link href="/admin/esqueci-senha" className="text-flame underline-offset-4 hover:underline">
            Esqueci minha senha
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
