import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ReviewActions } from "@/components/admin/ReviewActions";

export const metadata: Metadata = {
  title: "Avis Clients — Administration",
};

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  let reviews: any[] = [];
  try {
    reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { name: true, slug: true } },
      },
    });
  } catch {
    reviews = [];
  }

  const pending = reviews.filter((r) => !r.isApproved).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Avis Clients</h1>
        <p className="text-muted-foreground">
          {reviews.length} avis au total · {pending} en attente de modération
        </p>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium">Auteur</th>
              <th className="text-left p-4 text-sm font-medium">Produit</th>
              <th className="text-center p-4 text-sm font-medium">Note</th>
              <th className="text-left p-4 text-sm font-medium">Commentaire</th>
              <th className="text-center p-4 text-sm font-medium">Statut</th>
              <th className="text-left p-4 text-sm font-medium">Date</th>
              <th className="text-right p-4 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-muted/20">
                <td className="p-4 font-medium text-sm">
                  {review.authorName}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {review.product.name}
                </td>
                <td className="p-4 text-center">
                  {"⭐".repeat(review.rating)}
                </td>
                <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">
                  {review.comment}
                </td>
                <td className="p-4 text-center">
                  {review.isApproved ? (
                    <Badge variant="success">Approuvé</Badge>
                  ) : (
                    <Badge variant="secondary">En attente</Badge>
                  )}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {formatDate(review.createdAt)}
                </td>
                <td className="p-4 text-right">
                  <ReviewActions
                    reviewId={review.id}
                    isApproved={review.isApproved}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reviews.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Aucun avis pour l&apos;instant</p>
          </div>
        )}
      </div>
    </div>
  );
}
