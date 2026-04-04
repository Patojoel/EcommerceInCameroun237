"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageSquare, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { StarRating } from "@/components/shop/StarRating";
import { submitReview } from "@/lib/actions/review";

const reviewSchema = z.object({
  authorName: z.string().min(2, "Minimum 2 caractères"),
  comment: z.string().min(10, "Minimum 10 caractères"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? "s" : ""}`;
  return `Il y a ${Math.floor(diffDays / 30)} mois`;
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-indigo-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function ReviewSection({ productId, reviews }: ReviewSectionProps) {
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const onSubmit = async (values: ReviewFormValues) => {
    setIsSubmitting(true);
    const result = await submitReview({
      productId,
      authorName: values.authorName,
      rating,
      comment: values.comment,
    });
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Avis envoyé ! ✨",
        description: result.message,
      });
      reset();
      setRating(5);
      router.refresh();
    } else {
      toast({
        title: "Erreur",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Avis clients</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 ml-2">
              <StarRating rating={Math.round(avgRating)} readonly size="sm" />
              <span className="text-sm text-muted-foreground">
                {avgRating.toFixed(1)} ({reviews.length} avis)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Liste des avis */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 rounded-xl border bg-card hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${getAvatarColor(review.authorName)}`}
                >
                  {review.authorName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">
                      {review.authorName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {getRelativeTime(review.createdAt)}
                    </span>
                  </div>
                  <StarRating rating={review.rating} readonly size="sm" />
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>Aucun avis pour le moment. Soyez le premier !</p>
        </div>
      )}

      <Separator />

      {/* Formulaire de soumission */}
      <div className="p-6 rounded-xl border bg-muted/20">
        <h3 className="font-semibold text-lg mb-4">Laisser un avis</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Votre nom</Label>
              <Input
                placeholder="Ex: Jean"
                {...register("authorName")}
                className={errors.authorName ? "border-destructive" : ""}
              />
              {errors.authorName && (
                <p className="text-xs text-destructive">
                  {errors.authorName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Votre note</Label>
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                size="lg"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Votre commentaire</Label>
            <Textarea
              placeholder="Qu'avez-vous pensé de ce produit ?"
              rows={3}
              {...register("comment")}
              className={errors.comment ? "border-destructive" : ""}
            />
            {errors.comment && (
              <p className="text-xs text-destructive">
                {errors.comment.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              "Envoi..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Envoyer mon avis
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}
