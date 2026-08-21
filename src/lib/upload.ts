import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 6 * 1024 * 1024; // 6 MB
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

export type UploadResult = { url?: string; error?: string };

/** Salva a foto enviada pelo painel em /public/uploads e devolve a URL pública. */
export async function saveImage(file: File | null): Promise<UploadResult> {
  if (!file || file.size === 0) return {};

  const extension = EXTENSIONS[file.type];
  if (!extension) {
    return { error: "Formato não suportado. Use JPG, PNG, WEBP, AVIF ou GIF." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "A imagem passa de 6 MB. Reduza o tamanho e tente de novo." };
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, name), buffer);

  return { url: `/uploads/${name}` };
}

/** Apaga o arquivo antigo quando a foto é trocada ou removida. */
export async function deleteUpload(url: string | null | undefined) {
  if (!url?.startsWith("/uploads/")) return;
  const name = path.basename(url);
  await unlink(path.join(UPLOAD_DIR, name)).catch(() => {});
}
