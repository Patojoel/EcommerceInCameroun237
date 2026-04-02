import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface CategoryPageProps {
  params: { slug: string };
}

async function getCategory(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        include: { category: true },
        where: { stock: { gt: 0 } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory(params.slug);
  if (!category) return { title: "Catégorie introuvable" };
  return { title: `${category.name} — Catalogue` };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const categories = await prisma.category.findMany({
      select: { slug: true },
    });
    return categories.map((c: { slug: string }) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategory(params.slug);
  if (!category) notFound();

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{category.name}</h1>
          <p className="text-muted-foreground">
            {category.products.length} produit
            {category.products.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <ProductGrid products={category.products} />
    </div>
  );
}
