"use server";

import { prisma } from "@/lib/prisma";

export type ReviewData = {
  productId: string;
  authorName: string;
  rating: number;
  comment: string;
};

export async function submitReview(data: ReviewData) {
  try {
    if (data.rating < 1 || data.rating > 5) {
      return { success: false, error: "La note doit être entre 1 et 5" };
    }

    await prisma.review.create({
      data: {
        productId: data.productId,
        authorName: data.authorName,
        rating: data.rating,
        comment: data.comment,
        isApproved: false,
      },
    });

    return {
      success: true,
      message: "Merci ! Votre avis sera publié après modération.",
    };
  } catch (error) {
    console.error("Erreur soumission avis:", error);
    return { success: false, error: "Impossible de soumettre votre avis." };
  }
}

export async function approveReview(id: string) {
  try {
    await prisma.review.update({
      where: { id },
      data: { isApproved: true },
    });
    return { success: true };
  } catch (error) {
    console.error("Erreur approbation avis:", error);
    return { success: false, error: "Impossible d'approuver l'avis." };
  }
}

export async function deleteReview(id: string) {
  try {
    await prisma.review.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Erreur suppression avis:", error);
    return { success: false, error: "Impossible de supprimer l'avis." };
  }
}

export async function getApprovedReviews(productId: string) {
  return prisma.review.findMany({
    where: { productId, isApproved: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllReviews() {
  return prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { name: true, slug: true } },
    },
  });
}
