import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = {
  title: "Nouveau produit — Administration",
};

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  let categories: Array<{
    id: string;
    name: string;
    slug: string;
    image: string | null;
    createdAt: Date;
  }> = [];
  try {
    categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  } catch {
    categories = [];
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Nouveau produit</h1>
        <p className="text-muted-foreground">
          Ajouter un produit à la boutique
        </p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
