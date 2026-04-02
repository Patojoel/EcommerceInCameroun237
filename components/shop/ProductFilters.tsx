"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  categories: Category[];
  currentFilters: Record<string, string | undefined>;
}

export function ProductFilters({
  categories,
  currentFilters,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page");
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAll = () => {
    router.push("/products");
  };

  const hasFilters = Object.values(currentFilters).some(
    (v) => v !== undefined && v !== ""
  );

  const sortOptions = [
    { value: "", label: "Plus récents" },
    { value: "price_asc", label: "Prix croissant" },
    { value: "price_desc", label: "Prix décroissant" },
    { value: "name_asc", label: "Nom A-Z" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filtres</h2>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-muted-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Effacer
          </Button>
        )}
      </div>

      {/* Search */}
      <div>
        <Label className="mb-2 block">Recherche</Label>
        <Input
          placeholder="Chercher un produit..."
          defaultValue={currentFilters.search ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length === 0 || value.length >= 2) {
              updateFilter("search", value || null);
            }
          }}
        />
      </div>

      <Separator />

      {/* Sort */}
      <div>
        <Label className="mb-2 block">Trier par</Label>
        <div className="space-y-1">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateFilter("sortBy", option.value || null)}
              className={cn(
                "w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors",
                currentFilters.sortBy === option.value ||
                  (!currentFilters.sortBy && option.value === "")
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted text-muted-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <Label className="mb-2 block">Catégories</Label>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter("category", null)}
            className={cn(
              "w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors",
              !currentFilters.category
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-muted text-muted-foreground"
            )}
          >
            Toutes les catégories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter("category", cat.slug)}
              className={cn(
                "w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors",
                currentFilters.category === cat.slug
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted text-muted-foreground"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <Label className="mb-2 block">Prix (XAF)</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            defaultValue={currentFilters.minPrice ?? ""}
            onChange={(e) => updateFilter("minPrice", e.target.value || null)}
          />
          <Input
            type="number"
            placeholder="Max"
            defaultValue={currentFilters.maxPrice ?? ""}
            onChange={(e) => updateFilter("maxPrice", e.target.value || null)}
          />
        </div>
      </div>

      <Separator />

      {/* Stock */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="inStock"
          checked={currentFilters.inStock === "true"}
          onCheckedChange={(checked) =>
            updateFilter("inStock", checked ? "true" : null)
          }
        />
        <Label htmlFor="inStock">En stock uniquement</Label>
      </div>
    </div>
  );
}
