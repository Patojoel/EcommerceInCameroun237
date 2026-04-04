import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { RichContentRenderer } from "@/components/shop/RichContentRenderer";
import { BundleManager } from "@/components/admin/BundleManager";
import {
  ArrowLeft,
  Pencil,
  ExternalLink,
  Package,
  Tag,
  Calendar,
  Hash,
  Star,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Détail Produit — Administration",
};

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

async function getProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true, bundles: { orderBy: { createdAt: "desc" } } },
  });
}

export default async function AdminProductDetailPage({ params }: Props) {
  const product = await getProduct(params.id);

  if (!product) notFound();

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="-ml-3 mb-2">
            <Link href="/admin/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux produits
            </Link>
          </Button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {product.featured && (
              <Badge className="bg-yellow-100 text-yellow-800">
                <Star className="h-3 w-3 mr-1" />
                Vedette
              </Badge>
            )}
            {product.stock > 0 ? (
              <Badge variant="success">
                En stock ({product.stock})
              </Badge>
            ) : (
              <Badge variant="destructive">Rupture de stock</Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            ID: {product.id}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/products/${product.slug}`} target="_blank">
              <ExternalLink className="h-3 w-3 mr-1" />
              Voir en boutique
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/products/${product.id}/edit`}>
              <Pencil className="h-3 w-3 mr-1" />
              Éditer
            </Link>
          </Button>
          <DeleteProductButton
            productId={product.id}
            productName={product.name}
          />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Images */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Images</CardTitle>
          </CardHeader>
          <CardContent>
            {product.images.length > 0 ? (
              <div className="space-y-3">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute bottom-2 left-2 text-xs bg-black/70 text-white px-2 py-1 rounded">
                    Image principale
                  </span>
                </div>
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.slice(1).map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-lg overflow-hidden bg-muted"
                      >
                        <Image
                          src={img}
                          alt={`${product.name} ${idx + 2}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
                <p className="text-muted-foreground">Aucune image</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Infos */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" /> Prix
                </span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Package className="h-3.5 w-3.5" /> Stock
                </span>
                <span
                  className={`font-medium ${
                    product.stock === 0
                      ? "text-destructive"
                      : product.stock <= 5
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  {product.stock} unité{product.stock > 1 ? "s" : ""}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5" /> Catégorie
                </span>
                <Badge variant="secondary">{product.category.name}</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5" /> Slug
                </span>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {product.slug}
                </code>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Créé
                </span>
                <span className="text-sm">{formatDate(product.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Modifié
                </span>
                <span className="text-sm">{formatDate(product.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <RichContentRenderer
            content={product.description}
            className="text-muted-foreground"
          />
        </CardContent>
      </Card>

      {/* Bundles */}
      <BundleManager
        productId={product.id}
        productPrice={product.price}
        bundles={product.bundles}
      />
    </div>
  );
}
