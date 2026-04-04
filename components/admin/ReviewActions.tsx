"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { approveReview, deleteReview } from "@/lib/actions/review";

interface ReviewActionsProps {
  reviewId: string;
  isApproved: boolean;
}

export function ReviewActions({ reviewId, isApproved }: ReviewActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleApprove = async () => {
    setIsLoading(true);
    const result = await approveReview(reviewId);
    setIsLoading(false);

    if (result.success) {
      toast({ title: "Avis approuvé", description: "L'avis est maintenant visible sur le site." });
      router.refresh();
    } else {
      toast({ title: "Erreur", description: "Impossible d'approuver l'avis.", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!confirm("Voulez-vous vraiment supprimer cet avis définitivement ?")) return;
    
    setIsLoading(true);
    const result = await deleteReview(reviewId);
    setIsLoading(false);

    if (result.success) {
      toast({ title: "Avis supprimé" });
      router.refresh();
    } else {
      toast({ title: "Erreur", description: "Impossible de supprimer l'avis.", variant: "destructive" });
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {!isApproved && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleApprove}
          disabled={isLoading}
          className="text-green-600 border-green-200 hover:bg-green-50"
        >
          <Check className="h-4 w-4 mr-1" />
          Approuver
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={isLoading}
        className="text-destructive hover:text-destructive/90"
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Supprimer
      </Button>
    </div>
  );
}
