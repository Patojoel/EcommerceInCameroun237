"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "@/types";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const totalPrice = items.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0,
  );
  const totalItems = items.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground/30 mb-6" />
        <h1 className="text-2xl font-bold mb-2">Votre panier est vide</h1>
        <p className="text-muted-foreground mb-8">
          Découvrez nos produits authentiques camerounais
        </p>
        <Button asChild>
          <Link href="/products">Explorer la boutique</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continuer les achats
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">
          Mon panier ({totalItems} article{totalItems > 1 ? "s" : ""})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item: CartItem) => (
            <div
              key={item.productId}
              className="flex gap-4 p-4 rounded-xl border bg-card"
            >
              {/* Image */}
              <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-3xl">
                    🛍️
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.slug}`}
                  className="font-semibold hover:text-primary transition-colors line-clamp-2"
                >
                  {item.name}
                </Link>
                <p className="text-primary font-bold text-lg mt-1">
                  {formatPrice(item.price)}
                </p>

                <div className="flex items-center gap-4 mt-3">
                  {/* Quantity */}
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <span className="text-sm text-muted-foreground">
                    Sous-total :{" "}
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto text-destructive hover:text-destructive"
                    onClick={() => removeItem(item.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={clearCart}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Vider le panier
          </Button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border bg-card p-6 space-y-4">
            <h2 className="font-semibold text-lg">Récapitulatif</h2>
            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Sous-total ({totalItems} article{totalItems > 1 ? "s" : ""})
                </span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Livraison</span>
                <span className="text-muted-foreground">
                  Calculée à la commande
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">{formatPrice(totalPrice)}</span>
            </div>

            <Button size="lg" className="w-full" asChild>
              <Link href="/checkout">Passer la commande →</Link>
            </Button>

            <div className="flex flex-col gap-1 text-xs text-muted-foreground text-center">
              <span>🔒 Paiement 100% sécurisé</span>
              <span>💳 Stripe — Visa, Mastercard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
