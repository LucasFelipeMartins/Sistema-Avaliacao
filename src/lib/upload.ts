import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const BLOB_HOST = ".blob.vercel-storage.com";

// A Vercel recusa requisições acima de 4,5 MB antes de elas chegarem na server
// action, então o limite fica abaixo disso: assim o dono recebe um aviso claro
// em vez de um erro seco do navegador.
const MAX_BYTES = 4 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

export type UploadResult = { url?: string; error?: string };

/**
 * Onde a foto é guardada depende do ambiente: na Vercel o disco é somente
 * leitura e some a cada requisição, então com o token do Blob as fotos vão
 * para lá. Sem token (no computador) continuam em public/uploads/.
 */
function hasBlobStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** Salva a foto enviada pelo painel e devolve a URL pública. */
export async function saveImage(file: File | null): Promise<UploadResult> {
  if (!file || file.size === 0) return {};

  const extension = EXTENSIONS[file.type];
  if (!extension) {
    return { error: "Formato não suportado. Use JPG, PNG, WEBP, AVIF ou GIF." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "A imagem passa de 4 MB. Reduza o tamanho e tente de novo." };
  }

  const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${extension}`;

  if (hasBlobStore()) {
    try {
      const blob = await put(`lanches/${name}`, file, {
        access: "public",
        contentType: file.type,
      });
      return { url: blob.url };
    } catch (error) {
      console.error("[upload] falha ao enviar para o Blob:", error);
      return { error: "Não foi possível enviar a foto agora. Tente de novo." };
    }
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, name), buffer);

  return { url: `/uploads/${name}` };
}

/** Apaga o arquivo antigo quando a foto é trocada ou removida. */
export async function deleteUpload(url: string | null | undefined) {
  if (!url) return;

  if (url.startsWith("/uploads/")) {
    await unlink(path.join(UPLOAD_DIR, path.basename(url))).catch(() => {});
    return;
  }

  // Link colado de fora pelo dono não é nosso para apagar.
  if (!url.includes(BLOB_HOST)) return;

  await del(url).catch((error) => {
    console.error("[upload] falha ao apagar do Blob:", error);
  });
}
