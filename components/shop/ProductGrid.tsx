import { Product } from "@/types";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductSkeleton } from "@/components/shop/ProductSkeleton";
import { PackageX } from "lucide-react";

interface ProductGridProps {
  products: (Product & { category?: { name: string; slug: string } })[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <PackageX className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h3 className="font-semibold text-lg">Aucun produit trouvé</h3>
        <p className="text-muted-foreground mt-2">
          Essayez de modifier vos filtres ou votre recherche
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
