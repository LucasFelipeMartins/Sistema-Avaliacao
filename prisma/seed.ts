/**
 * Cria o estabelecimento, o acesso do painel e um cardápio de exemplo.
 * Rodar uma vez em cada instalação nova: `npm run db:seed`
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Hambúrgueres", position: 0 },
  { name: "Porções", position: 1 },
  { name: "Bebidas", position: 2 },
  { name: "Sobremesas", position: 3 },
];

const PRODUCTS = [
  {
    name: "Smash Clássico",
    ingredients: "2 blends de 90g, queijo cheddar, cebola caramelizada, molho da casa, pão brioche",
    priceCents: 2890,
    category: "Hambúrgueres",
    featured: true,
    position: 0,
  },
  {
    name: "Bacon Supremo",
    ingredients: "Blend 160g, bacon crocante, queijo prato, alface, tomate, maionese defumada",
    priceCents: 3490,
    category: "Hambúrgueres",
    featured: true,
    position: 1,
  },
  {
    name: "Cheddar Melt",
    ingredients: "Blend 160g, cheddar cremoso, cebola crispy, pão australiano",
    priceCents: 3290,
    category: "Hambúrgueres",
    position: 2,
  },
  {
    name: "Veggie da Casa",
    ingredients: "Hambúrguer de grão-de-bico, queijo vegano, rúcula, tomate seco, pão integral",
    priceCents: 2990,
    category: "Hambúrgueres",
    position: 3,
  },
  {
    name: "Batata Frita Cheddar & Bacon",
    ingredients: "Porção 400g, cheddar cremoso, bacon em cubos, cebolinha",
    priceCents: 2490,
    category: "Porções",
    featured: true,
    position: 0,
  },
  {
    name: "Onion Rings",
    ingredients: "8 unidades empanadas na hora, molho barbecue",
    priceCents: 1890,
    category: "Porções",
    position: 1,
  },
  {
    name: "Milkshake de Ovomaltine",
    ingredients: "500ml, sorvete de creme, Ovomaltine, chantilly",
    priceCents: 1990,
    category: "Bebidas",
    position: 0,
  },
  {
    name: "Refrigerante Lata",
    ingredients: "350ml — Coca-Cola, Guaraná, Fanta ou Sprite",
    priceCents: 700,
    category: "Bebidas",
    position: 1,
  },
  {
    name: "Petit Gateau",
    ingredients: "Bolo quente de chocolate com sorvete de creme",
    priceCents: 2290,
    category: "Sobremesas",
    position: 0,
  },
];

async function main() {
  const email = process.env.ADMIN_EMAIL || "dono@hamburgueria.com.br";
  const password = process.env.ADMIN_PASSWORD || "mudar123";

  const store = await prisma.store.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Burger House",
      tagline: "Artesanal, na brasa, do jeito que você gosta",
      adminEmail: email,
      passwordHash: await bcrypt.hash(password, 10),
      whatsapp: "(00) 00000-0000",
      openingHours: "Ter a Dom, 18h às 23h30",
      publicUrl: process.env.APP_URL || "http://localhost:3000",
    },
  });

  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: { position: category.position },
      create: category,
    });
  }

  const existingProducts = await prisma.product.count();
  if (existingProducts === 0) {
    for (const item of PRODUCTS) {
      const category = await prisma.category.findUnique({ where: { name: item.category } });
      await prisma.product.create({
        data: {
          name: item.name,
          ingredients: item.ingredients,
          priceCents: item.priceCents,
          featured: item.featured ?? false,
          position: item.position,
          categoryId: category?.id ?? null,
        },
      });
    }
    console.log(`${PRODUCTS.length} lanches de exemplo criados.`);
  } else {
    console.log("Ja existem lanches cadastrados - cardapio de exemplo nao foi recriado.");
  }

  console.log("");
  console.log("--- Instalacao pronta ---");
  console.log(`Estabelecimento: ${store.name}`);
  console.log(`Login do painel:  ${email}`);
  console.log(`Senha:            ${password}`);
  console.log(`Painel:           ${process.env.APP_URL || "http://localhost:3000"}/admin`);
  console.log("");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
