import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Shield, Truck, RefreshCcw } from "lucide-react";

type CategoryWithCount = Awaited<ReturnType<typeof getCategories>>[number];
type FeaturedProduct = Awaited<ReturnType<typeof getFeaturedProducts>>[number];

export const metadata: Metadata = {
  title: "Accueil — Boutique de produits camerounais",
  description:
    "Découvrez l'artisanat et les produits authentiques du Cameroun. Vêtements wax, bijoux, artisanat et saveurs locales.",
};

export const revalidate = 60;

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { featured: true, stock: { gt: 0 } },
      include: { category: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      take: 4,
    });
  } catch {
    return [];
  }
}

const features = [
  {
    icon: Shield,
    title: "Authenticité garantie",
    description: "Tous nos produits sont sélectionnés auprès d'artisans locaux",
  },
  {
    icon: Truck,
    title: "Livraison partout",
    description: "Livraison dans tout le Cameroun et à l'international",
  },
  {
    icon: RefreshCcw,
    title: "Retours faciles",
    description: "30 jours pour changer d'avis, sans questions",
  },
  {
    icon: Star,
    title: "Qualité premium",
    description: "Des produits de qualité issus du savoir-faire camerounais",
  },
];

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden">
        <div className="container py-20 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <Badge className="mb-4" variant="secondary">
              🇨🇲 Made in Cameroun
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              L&apos;artisanat camerounais{" "}
              <span className="text-primary">livré chez vous</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
              Découvrez une collection unique de vêtements traditionnels, bijoux
              artisanaux, et saveurs authentiques du Cameroun. Chaque produit
              raconte une histoire.
            </p>
            <div className="flex gap-4 mt-8 flex-wrap">
              <Button size="lg" asChild>
                <Link href="/products">
                  Explorer la boutique
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/categories/artisanat">Voir l&apos;artisanat</Link>
              </Button>
            </div>
            <div className="flex gap-6 mt-10 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                ✅ +200 produits authentiques
              </span>
              <span className="flex items-center gap-1">
                ✅ Artisans locaux certifiés
              </span>
              <span className="flex items-center gap-1">
                ✅ Livraison sécurisée
              </span>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent hidden md:block" />
        <div className="absolute bottom-0 right-20 text-[180px] opacity-10 hidden md:block">
          🇨🇲
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="container py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Nos catégories</h2>
              <p className="text-muted-foreground mt-1">
                Explorez notre sélection par univers
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/products">
                Tout voir <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category: CategoryWithCount) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-square bg-muted hover:shadow-xl transition-all duration-300"
              >
                {category.image && (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="font-bold text-white text-lg">
                    {category.name}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {category._count.products} produit
                    {category._count.products > 1 ? "s" : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="bg-muted/30 py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Produits populaires
                </h2>
                <p className="text-muted-foreground mt-1">
                  Les coups de cœur de nos clients
                </p>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/products">
                  Tout voir <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product: FeaturedProduct) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-16 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Prêt à découvrir le Cameroun ?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de clients satisfaits et explorez notre
            collection de produits authentiques.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/products">Commencer le shopping</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-primary"
              asChild
            >
              <Link href="/register">Créer un compte</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
