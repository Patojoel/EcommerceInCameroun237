"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Flame, Plus, Trash2, ToggleLeft, ToggleRight, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import {
  createBundle,
  deleteBundle,
  toggleBundleActive,
} from "@/lib/actions/bundle";

const bundleSchema = z.object({
  name: z.string().min(1, "Minimum 1 caractères"),
  description: z.string().optional(),
  quantity: z.number().int().min(1, "Minimum 1 unités"),
  price: z.number().positive("Le prix doit être positif"),
});

type BundleFormValues = z.infer<typeof bundleSchema>;

interface Bundle {
  id: string;
  name: string;
  description: string | null;
  quantity: number; 
  price: number;
  isActive: boolean;
  createdAt: Date;
}

interface BundleManagerProps {
  productId: string;
  productPrice: number;
  bundles: Bundle[];
}

export function BundleManager({
  productId,
  productPrice,
  bundles: initialBundles,
}: BundleManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BundleFormValues>({
    resolver: zodResolver(bundleSchema),
    defaultValues: { name: "", description: "", quantity: 2, price: 0 },
  });

  const onSubmit = async (values: BundleFormValues) => {
    setIsLoading(true);
    const result = await createBundle({
      productId,
      name: values.name,
      description: values.description,
      quantity: values.quantity,
      price: values.price,
    });
    setIsLoading(false);

    if (result.success) {
      toast({ title: "Bundle créé !", description: `${values.name} a été ajouté.` });
      reset();
      setShowForm(false);
      router.refresh();
    } else {
      toast({ title: "Erreur", description: result.error, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer le bundle "${name}" ?`)) return;
    const result = await deleteBundle(id);
    if (result.success) {
      toast({ title: "Supprimé", description: `${name} a été supprimé.` });
      router.refresh();
    }
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    const result = await toggleBundleActive(id, !currentActive);
    if (result.success) {
      toast({
        title: currentActive ? "Bundle désactivé" : "Bundle activé",
      });
      router.refresh();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Bundles / Promos ({initialBundles.length})
          </CardTitle>
          <Button
            size="sm"
            variant={showForm ? "outline" : "default"}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? (
              <>
                <X className="h-3 w-3 mr-1" /> Annuler
              </>
            ) : (
              <>
                <Plus className="h-3 w-3 mr-1" /> Nouveau bundle
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-4 border rounded-lg bg-muted/30 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom du bundle *</Label>
                <Input
                  placeholder='Ex: "Pack Famille"'
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Description (optionnel)</Label>
                <Input
                  placeholder="Ex: Idéal pour offrir"
                  {...register("description")}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantité dans le pack *</Label>
                <Input
                  type="number"
                  min={1}
                  {...register("quantity", { valueAsNumber: true })}
                />
                {errors.quantity && (
                  <p className="text-xs text-destructive">
                    {errors.quantity.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Prix du bundle (XAF) *</Label>
                <Input
                  type="number"
                  min={1}
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-xs text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Création..." : "Créer le bundle"}
            </Button>
          </form>
        )}

        {/* List */}
        {initialBundles.length === 0 && !showForm ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Aucun bundle pour ce produit. Créez-en un pour proposer des offres promo !
          </p>
        ) : (
          <div className="space-y-3">
            {initialBundles.map((bundle) => {
              const normalPrice = productPrice * bundle.quantity;
              const discount = calculateDiscount(normalPrice, bundle.price);
              return (
                <div
                  key={bundle.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    bundle.isActive
                      ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 dark:from-orange-950/20 dark:to-amber-950/20 dark:border-orange-800"
                      : "bg-muted/30 opacity-60"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{bundle.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        {bundle.quantity} unités
                      </Badge>
                      {discount > 0 && (
                        <Badge className="bg-red-500 text-white text-xs">
                          -{discount}%
                        </Badge>
                      )}
                      {!bundle.isActive && (
                        <Badge variant="outline" className="text-xs">
                          Inactif
                        </Badge>
                      )}
                    </div>
                    {bundle.description && (
                      <p className="text-xs text-muted-foreground">
                        {bundle.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground line-through">
                        {formatPrice(normalPrice)}
                      </span>
                      <span className="font-bold text-primary">
                        {formatPrice(bundle.price)}
                      </span>
                      <span className="text-xs text-green-600 font-medium">
                        Économie : {formatPrice(normalPrice - bundle.price)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleToggle(bundle.id, bundle.isActive)}
                      title={bundle.isActive ? "Désactiver" : "Activer"}
                    >
                      {bundle.isActive ? (
                        <ToggleRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(bundle.id, bundle.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
