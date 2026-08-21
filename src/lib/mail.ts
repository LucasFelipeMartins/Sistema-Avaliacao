import { appendFile } from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";

const DEV_LOG = path.join(process.cwd(), ".mail-dev.log");

type Mail = { to: string; subject: string; text: string; html: string };

/**
 * Envia por SMTP quando SMTP_HOST está configurado.
 * Sem SMTP (instalação nova / ambiente local) grava em .mail-dev.log,
 * assim a recuperação de senha continua utilizável durante os testes.
 */
export async function sendMail({ to, subject, text, html }: Mail) {
  const host = process.env.SMTP_HOST?.trim();

  if (!host) {
    const entry = `\n=== ${new Date().toISOString()} ===\nPara: ${to}\nAssunto: ${subject}\n\n${text}\n`;
    await appendFile(DEV_LOG, entry, "utf8");
    console.log(`[mail] SMTP não configurado — mensagem gravada em ${DEV_LOG}`);
    return { delivered: false as const };
  }

  const port = Number(process.env.SMTP_PORT ?? 587);
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });

  return { delivered: true as const };
}

export function passwordResetTemplate(storeName: string, link: string) {
  return {
    subject: `Redefinir a senha do painel — ${storeName}`,
    text:
      `Recebemos um pedido para redefinir a senha do painel de ${storeName}.\n\n` +
      `Abra o link abaixo (válido por 1 hora):\n${link}\n\n` +
      `Se não foi você, ignore este e-mail — nada muda.`,
    html: `
      <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#0b0b0c;padding:32px;color:#fff">
        <div style="max-width:480px;margin:0 auto;background:#141416;border-radius:16px;padding:32px">
          <h1 style="margin:0 0 8px;font-size:20px">Redefinir senha</h1>
          <p style="color:#a1a1aa;line-height:1.6;margin:0 0 24px">
            Recebemos um pedido para redefinir a senha do painel de
            <strong style="color:#fff">${storeName}</strong>. O link vale por 1 hora.
          </p>
          <a href="${link}" style="display:inline-block;background:#ff6a00;color:#0b0b0c;font-weight:700;
             text-decoration:none;padding:14px 24px;border-radius:999px">Criar nova senha</a>
          <p style="color:#71717a;font-size:13px;margin:24px 0 0">
            Se não foi você, é só ignorar este e-mail.
          </p>
        </div>
      </div>`,
  };
}
