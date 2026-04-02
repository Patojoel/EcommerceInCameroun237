"use client";

import { useState, useEffect } from "react";
import { Product, ProductFilters, PaginatedProducts } from "@/types";

export function useProducts(filters: ProductFilters = {}) {
  const [data, setData] = useState<PaginatedProducts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filters.categorySlug) params.set("category", filters.categorySlug);
        if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
        if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
        if (filters.inStock !== undefined)
          params.set("inStock", String(filters.inStock));
        if (filters.featured !== undefined)
          params.set("featured", String(filters.featured));
        if (filters.search) params.set("search", filters.search);
        if (filters.page) params.set("page", String(filters.page));
        if (filters.limit) params.set("limit", String(filters.limit));
        if (filters.sortBy) params.set("sortBy", filters.sortBy);

        const response = await fetch(`/api/products?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch products");

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [
    filters.categorySlug,
    filters.minPrice,
    filters.maxPrice,
    filters.inStock,
    filters.featured,
    filters.search,
    filters.page,
    filters.limit,
    filters.sortBy,
  ]);

  return { data, isLoading, error };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/products/${slug}`);
        if (!response.ok) {
          if (response.status === 404) throw new Error("Produit introuvable");
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  return { product, isLoading, error };
}
