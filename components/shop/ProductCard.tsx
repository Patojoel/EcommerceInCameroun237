"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useToast } from "@/components/ui/use-toast";

interface ProductCardProps {
  product: Product & { category?: { name: string; slug: string } };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      slug: product.slug,
      stock: product.stock,
      quantity: 1,
    });

    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`,
    });

    openCart();
  };

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-5xl">
              🛍️
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.featured && (
              <Badge className="text-xs">⭐ Populaire</Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="destructive" className="text-xs">
                Rupture
              </Badge>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <Badge variant="warning" className="text-xs">
                Plus que {product.stock}
              </Badge>
            )}
          </div>

          {/* Quick actions overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="translate-y-4 group-hover:translate-y-0 transition-transform delay-75"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          {product.category && (
            <p className="text-xs text-muted-foreground mb-1">
              {product.category.name}
            </p>
          )}
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-primary text-lg">
              {formatPrice(product.price)}
            </span>
            {product.stock > 0 ? (
              <span className="text-xs text-green-600 font-medium">En stock</span>
            ) : (
              <span className="text-xs text-red-500 font-medium">Épuisé</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
