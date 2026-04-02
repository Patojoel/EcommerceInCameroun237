import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      email: "admin@ecommerce237.cm",
      name: "Administrateur",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin created:", admin.email);

  // Create test customer
  const customerPassword = await bcrypt.hash("customer123", 12);
  const customer = await prisma.user.create({
    data: {
      email: "client@example.com",
      name: "Jean Dupont",
      password: customerPassword,
      role: "CUSTOMER",
    },
  });
  console.log("✅ Customer created:", customer.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Vêtements",
        slug: "vetements",
        image: "https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Accessoires",
        slug: "accessoires",
        image: "https://res.cloudinary.com/demo/image/upload/v1/samples/accessories.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Artisanat",
        slug: "artisanat",
        image: "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/architecture-signs.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Alimentation",
        slug: "alimentation",
        image: "https://res.cloudinary.com/demo/image/upload/v1/samples/food/dessert.jpg",
      },
    }),
  ]);
  console.log(`✅ ${categories.length} categories created`);

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Boubou traditionnel",
        slug: "boubou-traditionnel",
        description: "Magnifique boubou brodé à la main, tissu 100% coton local. Disponible en plusieurs couleurs. Taille unique ajustable.",
        price: 25000,
        stock: 15,
        images: [
          "https://res.cloudinary.com/demo/image/upload/v1/samples/people/boy-snow-hoodie.jpg",
        ],
        featured: true,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Robe wax africaine",
        slug: "robe-wax-africaine",
        description: "Belle robe en tissu wax authentique, motifs géométriques colorés. Confectionnée par des artisanes locales.",
        price: 18500,
        stock: 20,
        images: [
          "https://res.cloudinary.com/demo/image/upload/v1/samples/people/jazz.jpg",
        ],
        featured: true,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Sac raphia tressé",
        slug: "sac-raphia-tresse",
        description: "Sac à main artisanal en raphia tressé, finitions soignées. Pièce unique fabriquée à Yaoundé.",
        price: 12000,
        stock: 8,
        images: [
          "https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/leather-bag-gray.jpg",
        ],
        featured: true,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Collier bronze Bamiléké",
        slug: "collier-bronze-bamileke",
        description: "Bijou traditionnel en bronze, travail d'orfèvrerie Bamiléké. Chaque pièce est unique et raconte une histoire.",
        price: 8500,
        stock: 12,
        images: [
          "https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/accessories-bag.jpg",
        ],
        featured: false,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Masque décoratif Makaa",
        slug: "masque-decoratif-makaa",
        description: "Masque décoratif sculpté en bois d'ébène, art traditionnel de l'ethnie Makaa. Pièce collector.",
        price: 35000,
        stock: 5,
        images: [
          "https://res.cloudinary.com/demo/image/upload/v1/samples/animals/kitten-playing.jpg",
        ],
        featured: true,
        categoryId: categories[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Café arabica de l'Ouest",
        slug: "cafe-arabica-ouest",
        description: "Café arabica premium cultivé dans les hauts plateaux de l'Ouest Cameroun. Torréfaction artisanale. 500g.",
        price: 4500,
        stock: 50,
        images: [
          "https://res.cloudinary.com/demo/image/upload/v1/samples/food/coffee.jpg",
        ],
        featured: false,
        categoryId: categories[3].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Piment rouge séché",
        slug: "piment-rouge-seche",
        description: "Piment rouge de Foumban séché et moulu, condiment incontournable de la cuisine camerounaise. 200g.",
        price: 2500,
        stock: 100,
        images: [
          "https://res.cloudinary.com/demo/image/upload/v1/samples/food/fish-vegetables.jpg",
        ],
        featured: false,
        categoryId: categories[3].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Statue Fang sculptée",
        slug: "statue-fang-sculptee",
        description: "Réplique d'une statue ancestrale Fang sculptée dans du bois de kapokier. Art contemporain inspiré de la tradition.",
        price: 45000,
        stock: 3,
        images: [
          "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/architecture-signs.jpg",
        ],
        featured: false,
        categoryId: categories[2].id,
      },
    }),
  ]);
  console.log(`✅ ${products.length} products created`);

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📋 Login credentials:");
  console.log("  Admin: admin@ecommerce237.cm / admin123");
  console.log("  Client: client@example.com / customer123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
