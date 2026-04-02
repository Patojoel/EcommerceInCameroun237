import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export const metadata: Metadata = {
  title: "Produits — Administration",
};

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    products = [];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produits</h1>
          <p className="text-muted-foreground">
            {products.length} produit{products.length > 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau produit
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium">Produit</th>
              <th className="text-left p-4 text-sm font-medium">Catégorie</th>
              <th className="text-right p-4 text-sm font-medium">Prix</th>
              <th className="text-right p-4 text-sm font-medium">Stock</th>
              <th className="text-center p-4 text-sm font-medium">Vedette</th>
              <th className="text-right p-4 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-muted/20">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-lg">
                          🛍️
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant="secondary">{product.category.name}</Badge>
                </td>
                <td className="p-4 text-right font-medium">
                  {formatPrice(product.price)}
                </td>
                <td className="p-4 text-right">
                  <span
                    className={
                      product.stock === 0
                        ? "text-destructive font-medium"
                        : product.stock <= 5
                          ? "text-yellow-600 font-medium"
                          : ""
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {product.featured ? "⭐" : "—"}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Aucun produit pour l&apos;instant</p>
            <Button asChild className="mt-4">
              <Link href="/admin/products/new">Créer le premier produit</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
