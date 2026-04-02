"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus, Check } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useToast } from "@/components/ui/use-toast";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCartStore();
  const { toast } = useToast();

  const handleAdd = () => {
    if (product.stock === 0) return;

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      slug: product.slug,
      stock: product.stock,
      quantity,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);

    toast({
      title: "Produit ajouté !",
      description: `${quantity}x ${product.name} ajouté au panier.`,
    });

    openCart();
  };

  if (product.stock === 0) {
    return (
      <Button size="lg" disabled className="w-full">
        Produit épuisé
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quantity */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Quantité :</span>
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-r-none"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-l-none"
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            disabled={quantity >= product.stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">
          {product.stock} disponible{product.stock > 1 ? "s" : ""}
        </span>
      </div>

      {/* Add Button */}
      <Button size="lg" className="w-full" onClick={handleAdd}>
        {added ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            Ajouté au panier !
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Ajouter au panier
          </>
        )}
      </Button>
    </div>
  );
}
