import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { Suspense } from "react";
import { ProductSkeleton } from "@/components/shop/ProductSkeleton";

export const metadata: Metadata = {
  title: "Catalogue — Tous nos produits",
  description:
    "Parcourez notre catalogue de produits authentiques camerounais.",
};

export const revalidate = 30;

interface ProductsPageProps {
  searchParams: {
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sortBy?: string;
    page?: string;
  };
}

async function getProducts(searchParams: ProductsPageProps["searchParams"]) {
  const page = Number(searchParams.page) || 1;
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (searchParams.category) {
    where.category = { slug: searchParams.category };
  }

  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: "insensitive" } },
      { description: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    const priceFilter: Record<string, number> = {};
    if (searchParams.minPrice) priceFilter.gte = Number(searchParams.minPrice);
    if (searchParams.maxPrice) priceFilter.lte = Number(searchParams.maxPrice);
    where.price = priceFilter;
  }

  if (searchParams.inStock === "true") {
    where.stock = { gt: 0 };
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (searchParams.sortBy === "price_asc") orderBy = { price: "asc" };
  if (searchParams.sortBy === "price_desc") orderBy = { price: "desc" };
  if (searchParams.sortBy === "name_asc") orderBy = { name: "asc" };

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch {
    return { products: [], total: 0, page, limit, totalPages: 0 };
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({ orderBy: { name: "asc" } });
  } catch {
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const [{ products, total, page, totalPages }, categories] = await Promise.all(
    [getProducts(searchParams), getCategories()],
  );

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Catalogue</h1>
        <p className="text-muted-foreground mt-1">
          {total} produit{total > 1 ? "s" : ""} disponible
          {total > 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <Suspense
            fallback={
              <div className="space-y-4">
                <ProductSkeleton />
              </div>
            }
          >
            <ProductFilters
              categories={categories}
              currentFilters={searchParams}
            />
          </Suspense>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          <ProductGrid products={products} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => {
                  const params = new URLSearchParams(
                    searchParams as Record<string, string>,
                  );
                  params.set("page", String(pageNum));
                  return (
                    <a
                      key={pageNum}
                      href={`/products?${params.toString()}`}
                      className={`h-9 w-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                        pageNum === page
                          ? "bg-primary text-primary-foreground"
                          : "border hover:bg-accent"
                      }`}
                    >
                      {pageNum}
                    </a>
                  );
                },
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
