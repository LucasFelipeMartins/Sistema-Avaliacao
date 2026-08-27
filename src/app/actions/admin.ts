"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isId, prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { parsePriceToCents } from "@/lib/format";
import { STORE_ID } from "@/lib/store";
import { deleteUpload, saveImage } from "@/lib/upload";

export type FormState = { error?: string; success?: string };

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/lanches");
}

/** Id vindo de um campo escondido do formulário, já conferido como ObjectId. */
function formId(formData: FormData) {
  const value = String(formData.get("id") ?? "");
  return isId(value) ? value : null;
}

/* ----------------------------------------------------------------- lanches */

export async function saveProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireSession();

  const id = formId(formData);
  const editing = Boolean(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const ingredients = String(formData.get("ingredients") ?? "").trim();
  const priceCents = parsePriceToCents(String(formData.get("price") ?? ""));
  const categoryRaw = String(formData.get("categoryId") ?? "");
  const categoryId = isId(categoryRaw) ? categoryRaw : null;
  const available = formData.get("available") === "on";
  const featured = formData.get("featured") === "on";
  const removeImage = formData.get("removeImage") === "1";
  const imageUrlField = String(formData.get("imageUrl") ?? "").trim();

  if (name.length < 2) return { error: "Dê um nome ao lanche." };
  if (priceCents === null) return { error: "Preço inválido. Use o formato 25,90." };
  if (editing && !id) return { error: "Lanche não encontrado." };

  const current = id ? await prisma.product.findUnique({ where: { id } }) : null;
  if (id && !current) return { error: "Lanche não encontrado." };

  const upload = await saveImage(formData.get("image") as File | null);
  if (upload.error) return { error: upload.error };

  let imageUrl = current?.imageUrl ?? null;
  if (upload.url) {
    await deleteUpload(current?.imageUrl);
    imageUrl = upload.url;
  } else if (removeImage) {
    await deleteUpload(current?.imageUrl);
    imageUrl = null;
  } else if (imageUrlField && imageUrlField !== current?.imageUrl) {
    // permite colar o link de uma foto hospedada fora
    if (!/^https?:\/\//i.test(imageUrlField)) {
      return { error: "O link da foto precisa começar com http:// ou https://" };
    }
    await deleteUpload(current?.imageUrl);
    imageUrl = imageUrlField;
  }

  const data = { name, ingredients, priceCents, categoryId, available, featured, imageUrl };

  if (id) {
    await prisma.product.update({ where: { id }, data });
  } else {
    const last = await prisma.product.findFirst({
      where: { categoryId },
      orderBy: { position: "desc" },
    });
    await prisma.product.create({ data: { ...data, position: (last?.position ?? -1) + 1 } });
  }

  refresh();
  redirect("/admin/lanches?salvo=1");
}

export async function deleteProduct(formData: FormData) {
  await requireSession();
  const id = formId(formData);
  if (!id) return;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;

  await deleteUpload(product.imageUrl);
  await prisma.product.delete({ where: { id } });
  refresh();
}

export async function toggleAvailability(formData: FormData) {
  await requireSession();
  const id = formId(formData);
  if (!id) return;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;

  await prisma.product.update({ where: { id }, data: { available: !product.available } });
  refresh();
}

export async function toggleFeatured(formData: FormData) {
  await requireSession();
  const id = formId(formData);
  if (!id) return;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;

  await prisma.product.update({ where: { id }, data: { featured: !product.featured } });
  refresh();
}

/** Sobe ou desce o lanche dentro da categoria, trocando a posição com o vizinho. */
export async function moveProduct(formData: FormData) {
  await requireSession();
  const id = formId(formData);
  if (!id) return;

  const direction = String(formData.get("direction")) === "up" ? "up" : "down";

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;

  const neighbour = await prisma.product.findFirst({
    where: {
      categoryId: product.categoryId,
      position: direction === "up" ? { lt: product.position } : { gt: product.position },
    },
    orderBy: { position: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbour) return;

  await prisma.$transaction([
    prisma.product.update({ where: { id: product.id }, data: { position: neighbour.position } }),
    prisma.product.update({ where: { id: neighbour.id }, data: { position: product.position } }),
  ]);
  refresh();
}

/* -------------------------------------------------------------- categorias */

export async function saveCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireSession();

  const id = formId(formData);
  const name = String(formData.get("name") ?? "").trim();

  if (name.length < 2) return { error: "Dê um nome à categoria." };

  const duplicate = await prisma.category.findUnique({ where: { name } });
  if (duplicate && duplicate.id !== id) return { error: "Já existe uma categoria com esse nome." };

  if (id) {
    await prisma.category.update({ where: { id }, data: { name } });
  } else {
    const last = await prisma.category.findFirst({ orderBy: { position: "desc" } });
    await prisma.category.create({ data: { name, position: (last?.position ?? -1) + 1 } });
  }

  refresh();
  revalidatePath("/admin/categorias");
  return { success: id ? "Categoria atualizada." : "Categoria criada." };
}

export async function deleteCategory(formData: FormData) {
  await requireSession();
  const id = formId(formData);
  if (!id) return;

  // Os lanches não são apagados: ficam sem categoria (onDelete: SetNull).
  await prisma.category.delete({ where: { id } });
  refresh();
  revalidatePath("/admin/categorias");
}

export async function moveCategory(formData: FormData) {
  await requireSession();
  const id = formId(formData);
  if (!id) return;

  const direction = String(formData.get("direction")) === "up" ? "up" : "down";

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return;

  const neighbour = await prisma.category.findFirst({
    where: { position: direction === "up" ? { lt: category.position } : { gt: category.position } },
    orderBy: { position: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbour) return;

  await prisma.$transaction([
    prisma.category.update({ where: { id: category.id }, data: { position: neighbour.position } }),
    prisma.category.update({ where: { id: neighbour.id }, data: { position: category.position } }),
  ]);
  refresh();
  revalidatePath("/admin/categorias");
}

/* ------------------------------------------------------- dados da loja */

export async function saveStore(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireSession();

  const name = String(formData.get("name") ?? "").trim();
  const adminEmail = String(formData.get("adminEmail") ?? "").trim().toLowerCase();

  if (name.length < 2) return { error: "Informe o nome do estabelecimento." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(adminEmail)) {
    return { error: "E-mail inválido — ele é usado para recuperar a senha." };
  }

  const store = await prisma.store.findUnique({ where: { id: STORE_ID } });
  const upload = await saveImage(formData.get("logo") as File | null);
  if (upload.error) return { error: upload.error };

  let logoUrl = store?.logoUrl ?? null;
  if (upload.url) {
    await deleteUpload(store?.logoUrl);
    logoUrl = upload.url;
  } else if (formData.get("removeLogo") === "1") {
    await deleteUpload(store?.logoUrl);
    logoUrl = null;
  }

  await prisma.store.update({
    where: { id: STORE_ID },
    data: {
      name,
      adminEmail,
      logoUrl,
      tagline: String(formData.get("tagline") ?? "").trim(),
      whatsapp: String(formData.get("whatsapp") ?? "").trim() || null,
      instagram: String(formData.get("instagram") ?? "").trim() || null,
      address: String(formData.get("address") ?? "").trim() || null,
      openingHours: String(formData.get("openingHours") ?? "").trim() || null,
      publicUrl: String(formData.get("publicUrl") ?? "").trim() || null,
    },
  });

  refresh();
  revalidatePath("/admin/configuracoes");
  revalidatePath("/admin/qrcode");
  return { success: "Dados salvos." };
}

/* ----------------------------------------------------------- avaliações */

export async function deleteReview(formData: FormData) {
  await requireSession();
  const id = formId(formData);
  if (!id) return;

  await prisma.review.delete({ where: { id } });
  refresh();
  revalidatePath("/admin/avaliacoes");
}
