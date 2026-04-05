import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Shield, Truck, RefreshCcw, Sparkles, Zap, Heart } from "lucide-react";
import { HeroSection } from "@/components/shop/HeroSection";
import { AnimatedCounter } from "@/components/shop/AnimatedCounter";


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

async function getProductCount() {
  try {
    return await prisma.product.count();
  } catch {
    return 0;
  }
}

const features = [
  {
    icon: Shield,
    title: "Authenticité garantie",
    description: "Tous nos produits sont sélectionnés auprès d'artisans locaux",
    gradient: "from-emerald-500/10 to-green-500/5",
    iconColor: "text-emerald-500",
  },
  {
    icon: Truck,
    title: "Livraison partout",
    description: "Livraison dans tout le Cameroun et à l'international",
    gradient: "from-blue-500/10 to-sky-500/5",
    iconColor: "text-blue-500",
  },
  {
    icon: RefreshCcw,
    title: "Retours faciles",
    description: "30 jours pour changer d'avis, sans questions",
    gradient: "from-purple-500/10 to-violet-500/5",
    iconColor: "text-purple-500",
  },
  {
    icon: Star,
    title: "Qualité premium",
    description: "Des produits de qualité issus du savoir-faire camerounais",
    gradient: "from-amber-500/10 to-yellow-500/5",
    iconColor: "text-amber-500",
  },
];

export default async function HomePage() {
  const [featuredProducts, categories, productCount] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getProductCount(),
  ]);

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero Section — Ultra-modern animated */}
      <HeroSection productCount={productCount} />

      {/* Animated Stats Bar */}
      <section className="relative -mt-8 z-20">
        <div className="container">
          <div className="bg-card/95 backdrop-blur-xl border rounded-2xl shadow-2xl p-6 sm:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <AnimatedCounter end={productCount > 0 ? productCount : 200} label="Produits" suffix="+" emoji="🛍️" />
              <AnimatedCounter end={1500} label="Clients satisfaits" suffix="+" emoji="😊" />
              <AnimatedCounter end={98} label="Satisfaction" suffix="%" emoji="⭐" />
              <AnimatedCounter end={237} label="Livraisons/mois" suffix="+" emoji="🚚" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="container py-16 sm:py-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Badge variant="secondary" className="mb-2">
                <Sparkles className="h-3 w-3 mr-1" />
                Collections
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold">Nos univers</h2>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Explorez notre sélection par catégorie
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/products">
                Tout voir <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((category: CategoryWithCount) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-square bg-muted hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
              >
                {category.image && (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-3 sm:p-4">
                  <h3 className="font-bold text-white text-sm sm:text-lg">
                    {category.name}
                  </h3>
                  <p className="text-white/70 text-xs sm:text-sm">
                    {category._count.products} produit
                    {category._count.products > 1 ? "s" : ""}
                  </p>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-white/90 text-foreground px-4 py-2 rounded-full text-xs sm:text-sm font-semibold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Explorer →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-6 sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/products">
                Voir toutes les catégories <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="relative py-16 sm:py-20">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30" />
          <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />

          <div className="container relative">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Badge variant="secondary" className="mb-2">
                  <Zap className="h-3 w-3 mr-1" />
                  Tendances
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Produits populaires
                </h2>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Les coups de cœur de nos clients
                </p>
              </div>
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link href="/products">
                  Tout voir <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
              {featuredProducts.map((product: FeaturedProduct) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="flex justify-center mt-8 sm:hidden">
              <Button variant="outline" asChild>
                <Link href="/products">
                  Voir tous les produits <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Features — Premium cards */}
      <section className="container py-16 sm:py-20">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-2">
            <Heart className="h-3 w-3 mr-1" />
            Nos garanties
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold">Pourquoi nous choisir ?</h2>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`relative group text-center p-6 rounded-2xl border bg-gradient-to-br ${feature.gradient} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex justify-center mb-4">
                  <div className={`h-14 w-14 rounded-2xl bg-background shadow-sm flex items-center justify-center ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7" />
                  </div>
                </div>
                <h3 className="font-bold text-sm sm:text-base mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Banner — Premium */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/80" />
        {/* Decorative shapes */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-sm" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-sm" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full blur-3xl" />

        <div className="container relative py-16 sm:py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="text-5xl sm:text-6xl mb-4 block animate-float">🇨🇲</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
              Prêt à découvrir le Cameroun ?
            </h2>
            <p className="text-primary-foreground/80 text-sm sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Rejoignez des milliers de clients satisfaits et explorez notre
              collection de produits authentiques.
            </p>
            <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
              <Button size="lg" variant="secondary" className="shadow-xl hover:shadow-2xl transition-shadow animate-glow-pulse" asChild>
                <Link href="/products">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Commencer le shopping
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10 backdrop-blur-sm"
                asChild
              >
                <Link href="/register">Créer un compte</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
