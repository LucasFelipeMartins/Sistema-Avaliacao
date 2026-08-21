import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const COOKIE = "hb_session";
const SESSION_DAYS = 30;
const RESET_MINUTES = 60;

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}

export function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

/** Comparação de strings resistente a timing attack. */
export function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function createSession() {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({ data: { tokenHash: sha256(token), expiresAt } });
  await prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function getSession() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: sha256(token) },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session;
}

/** Usado nas páginas do painel: sem sessão válida, volta para o login. */
export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: sha256(token) } });
  }
  jar.delete(COOKIE);
}

/** Invalida todas as sessões (usado ao trocar a senha). */
export async function destroyAllSessions() {
  await prisma.session.deleteMany();
  (await cookies()).delete(COOKIE);
}

export async function createPasswordReset() {
  const token = randomBytes(32).toString("hex");
  await prisma.passwordReset.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  await prisma.passwordReset.create({
    data: {
      tokenHash: sha256(token),
      expiresAt: new Date(Date.now() + RESET_MINUTES * 60 * 1000),
    },
  });
  return token;
}

export async function consumePasswordReset(token: string) {
  const record = await prisma.passwordReset.findUnique({
    where: { tokenHash: sha256(token) },
  });
  if (!record || record.usedAt || record.expiresAt < new Date()) return false;

  await prisma.passwordReset.update({
    where: { tokenHash: record.tokenHash },
    data: { usedAt: new Date() },
  });
  return true;
}

export async function isResetTokenValid(token: string) {
  const record = await prisma.passwordReset.findUnique({
    where: { tokenHash: sha256(token) },
  });
  return Boolean(record && !record.usedAt && record.expiresAt >= new Date());
}
