"use client";

import { Flame, Sparkles, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice, calculateDiscount } from "@/lib/utils";

interface Bundle {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  price: number;
  isActive: boolean;
}

interface BundleCardProps {
  bundles: Bundle[];
  productPrice: number;
  onSelectBundle: (bundle: Bundle | null) => void;
  selectedBundleId: string | null;
}

export function BundleCard({
  bundles,
  productPrice,
  onSelectBundle,
  selectedBundleId,
}: BundleCardProps) {
  const activeBundles = bundles.filter((b) => b.isActive);

  if (activeBundles.length === 0) return null;

  const bundlesWithDetails = activeBundles.map(bundle => {
    const normalPrice = productPrice * bundle.quantity;
    const discount = calculateDiscount(normalPrice, bundle.price);
    return { ...bundle, normalPrice, discount };
  });

  // Trier par remise croissante
  bundlesWithDetails.sort((a, b) => a.discount - b.discount);

  let orderedBundles = [...bundlesWithDetails];
  let popularBundleId: string | null = null;

  if (bundlesWithDetails.length >= 3) {
    const lowest = bundlesWithDetails[0];
    const highest = bundlesWithDetails[bundlesWithDetails.length - 1];
    const rest = bundlesWithDetails.slice(1, -1);
    
    // Ordre: Plus bas, Plus haut (milieu), le reste (fin)
    orderedBundles = [lowest, highest, ...rest];
    popularBundleId = highest.id;
  } else if (bundlesWithDetails.length > 0) {
    popularBundleId = bundlesWithDetails[bundlesWithDetails.length - 1].id;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Flame className="h-5 w-5 text-orange-500" />
        <h3 className="font-bold text-lg">Offres Spéciales</h3>
        <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
      </div>

      <div className="grid gap-4">
        {orderedBundles.map((bundle) => {
          const normalPrice = bundle.normalPrice;
          const discount = bundle.discount;
          const savings = normalPrice - bundle.price;
          const isSelected = selectedBundleId === bundle.id;
          const isPopular = bundle.id === popularBundleId;

          return (
            <button
              key={bundle.id}
              type="button"
              onClick={() => onSelectBundle(isSelected ? null : bundle)}
              className={`relative w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                isPopular ? "mt-2" : ""
              } ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.01]"
                  : "border-orange-200 bg-gradient-to-r from-orange-50/80 to-amber-50/80 hover:border-primary/50 hover:shadow-md dark:from-orange-950/20 dark:to-amber-950/20 dark:border-orange-700"
              }`}
            >
              {/* Badge Populaire */}
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                  <Badge className="bg-primary hover:bg-primary text-primary-foreground text-xs font-bold px-3 py-1 shadow-md whitespace-nowrap">
                    ⭐ Plus Populaire
                  </Badge>
                </div>
              )}

              {/* Discount badge */}
              {discount > 0 && (
                <div className="absolute -top-2.5 -right-2 z-10">
                  <Badge className="bg-red-500 hover:bg-red-500 text-white text-xs font-bold px-2 py-0.5 shadow-md animate-bounce">
                    -{discount}%
                  </Badge>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base">{bundle.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {bundle.quantity} unités
                    </Badge>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30"
                    }`}
                  >
                    {isSelected && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>

                {bundle.description && (
                  <p className="text-xs text-muted-foreground">
                    {bundle.description}
                  </p>
                )}

                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(normalPrice)}
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(bundle.price)}
                  </span>
                  {savings > 0 && (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                      <TrendingDown className="h-3 w-3" />
                      Économisez {formatPrice(savings)}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
