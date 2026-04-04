"use server";

import { prisma } from "@/lib/prisma";

export type BundleData = {
  productId: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  isActive?: boolean;
};

export async function createBundle(data: BundleData) {
  try {
    const bundle = await prisma.bundle.create({
      data: {
        productId: data.productId,
        name: data.name,
        description: data.description ?? null,
        quantity: data.quantity,
        price: data.price,
        isActive: data.isActive ?? true,
      },
    });
    return { success: true, bundle };
  } catch (error) {
    console.error("Erreur création bundle:", error);
    return { success: false, error: "Impossible de créer le bundle" };
  }
}

export async function updateBundle(id: string, data: Partial<BundleData>) {
  try {
    const bundle = await prisma.bundle.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.quantity !== undefined && { quantity: data.quantity }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
    return { success: true, bundle };
  } catch (error) {
    console.error("Erreur mise à jour bundle:", error);
    return { success: false, error: "Impossible de modifier le bundle" };
  }
}

export async function deleteBundle(id: string) {
  try {
    await prisma.bundle.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Erreur suppression bundle:", error);
    return { success: false, error: "Impossible de supprimer le bundle" };
  }
}

export async function toggleBundleActive(id: string, isActive: boolean) {
  try {
    await prisma.bundle.update({
      where: { id },
      data: { isActive },
    });
    return { success: true };
  } catch (error) {
    console.error("Erreur toggle bundle:", error);
    return { success: false, error: "Impossible de modifier le statut" };
  }
}

export async function getBundlesByProduct(productId: string) {
  return prisma.bundle.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
  });
}
