import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { ProductCard } from "@/components/shop/ProductCard";
import { ArrowLeft, Package, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductPageProps {
  params: { slug: string };
}

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

async function getRelatedProducts(categoryId: string, currentId: string) {
  return prisma.product.findMany({
    where: {
      categoryId,
      id: { not: currentId },
      stock: { gt: 0 },
    },
    include: { category: true },
    take: 4,
  });
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Produit introuvable" };

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      select: { slug: true },
    });
    return products.map((p: { slug: string }) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(
    product.categoryId,
    product.id,
  );

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">
          Accueil
        </Link>
        <span>/</span>
        <Link
          href="/products"
          className="hover:text-foreground transition-colors"
        >
          Catalogue
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`/categories/${product.category.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </div>

      {/* Back button */}
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
        <Link href="/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au catalogue
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-8xl">
                🛍️
              </div>
            )}
            {product.featured && (
              <Badge className="absolute top-4 left-4">⭐ Populaire</Badge>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((image: string, idx: number) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-lg overflow-hidden bg-muted border-2 border-transparent hover:border-primary transition-colors cursor-pointer"
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${idx + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 25vw, 12vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {product.category && (
            <div>
              <Link
                href={`/categories/${product.category.slug}`}
                className="text-sm text-primary font-medium hover:underline"
              >
                {product.category.name}
              </Link>
            </div>
          )}

          <h1 className="text-3xl font-bold leading-tight">{product.name}</h1>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-4xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.stock > 0 ? (
              <Badge variant="success">
                En stock ({product.stock} disponible
                {product.stock > 1 ? "s" : ""})
              </Badge>
            ) : (
              <Badge variant="destructive">Rupture de stock</Badge>
            )}
          </div>

          <Separator />

          <div>
            <h2 className="font-semibold mb-3">Description</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <Separator />

          {/* Add to Cart */}
          <AddToCartButton product={product} />

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center p-3 rounded-xl bg-muted/50">
              <Shield className="h-5 w-5 mx-auto mb-1.5 text-primary" />
              <p className="text-xs text-muted-foreground leading-snug">
                Authenticité garantie
              </p>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/50">
              <Truck className="h-5 w-5 mx-auto mb-1.5 text-primary" />
              <p className="text-xs text-muted-foreground leading-snug">
                Livraison rapide
              </p>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/50">
              <Package className="h-5 w-5 mx-auto mb-1.5 text-primary" />
              <p className="text-xs text-muted-foreground leading-snug">
                Emballage soigné
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <Separator className="mb-10" />
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Produits similaires</h2>
            {product.category && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/categories/${product.category.slug}`}>
                  Voir tout
                </Link>
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p: (typeof relatedProducts)[number]) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
