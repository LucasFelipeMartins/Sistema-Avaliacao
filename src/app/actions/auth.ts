"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { appUrl, getStore } from "@/lib/store";
import { passwordResetTemplate, sendMail } from "@/lib/mail";
import {
  consumePasswordReset,
  createPasswordReset,
  createSession,
  destroyAllSessions,
  destroySession,
  hashPassword,
  requireSession,
  verifyPassword,
} from "@/lib/auth";

export type FormState = { error?: string; success?: string };

// Freio simples contra tentativa de força bruta no login (por processo).
const attempts = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 8;
const LOCK_MS = 10 * 60 * 1000;

function checkLock(key: string) {
  const record = attempts.get(key);
  if (record && record.until > Date.now() && record.count >= MAX_ATTEMPTS) {
    const minutes = Math.ceil((record.until - Date.now()) / 60000);
    return `Muitas tentativas. Tente novamente em ${minutes} min.`;
  }
  return null;
}

function registerFailure(key: string) {
  const record = attempts.get(key);
  if (!record || record.until < Date.now()) {
    attempts.set(key, { count: 1, until: Date.now() + LOCK_MS });
  } else {
    record.count += 1;
    record.until = Date.now() + LOCK_MS;
  }
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const locked = checkLock(email);
  if (locked) return { error: locked };

  const store = await getStore();
  if (!store) return { error: "Instalação não configurada. Rode `npm run db:seed`." };

  const emailOk = email === store.adminEmail.trim().toLowerCase();
  const passwordOk = await verifyPassword(password, store.passwordHash);

  if (!emailOk || !passwordOk) {
    registerFailure(email);
    return { error: "E-mail ou senha incorretos." };
  }

  attempts.delete(email);
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function requestPasswordReset(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const store = await getStore();

  // Resposta idêntica em qualquer caso: não revela se o e-mail existe.
  const generic = {
    success:
      "Se este e-mail estiver cadastrado, o link de recuperação chega em instantes. Confira também a caixa de spam.",
  };

  if (!store || email !== store.adminEmail.trim().toLowerCase()) return generic;

  const token = await createPasswordReset();
  const link = `${appUrl()}/admin/redefinir-senha?token=${token}`;
  const template = passwordResetTemplate(store.name, link);

  try {
    await sendMail({ to: store.adminEmail, ...template });
  } catch (error) {
    console.error("[reset] falha ao enviar e-mail:", error);
    return { error: "Não foi possível enviar o e-mail. Confira as configurações de SMTP." };
  }

  return generic;
}

export async function resetPassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) return { error: "A senha precisa ter pelo menos 8 caracteres." };
  if (password !== confirm) return { error: "As senhas não são iguais." };

  const valid = await consumePasswordReset(token);
  if (!valid) return { error: "Link inválido ou expirado. Peça um novo." };

  await prisma.store.update({
    where: { id: 1 },
    data: { passwordHash: await hashPassword(password) },
  });
  await destroyAllSessions();

  redirect("/admin/login?redefinida=1");
}

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireSession();

  const current = String(formData.get("current") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const store = await getStore();
  if (!store) return { error: "Estabelecimento não encontrado." };

  if (!(await verifyPassword(current, store.passwordHash))) {
    return { error: "A senha atual está incorreta." };
  }
  if (password.length < 8) return { error: "A nova senha precisa ter pelo menos 8 caracteres." };
  if (password !== confirm) return { error: "As senhas não são iguais." };

  await prisma.store.update({
    where: { id: 1 },
    data: { passwordHash: await hashPassword(password) },
  });

  return { success: "Senha alterada com sucesso." };
}
