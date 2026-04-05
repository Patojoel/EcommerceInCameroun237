"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { submitDirectOrder } from "@/lib/actions/order";
import { BundleCard } from "@/components/shop/BundleCard";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(8, "Veuillez entrer un numéro de téléphone valide"),
  city: z.string().min(2, "La ville est requise"),
  address: z.string().min(3, "L'adresse ou le quartier est requis"),
});

type FormValues = z.infer<typeof formSchema>;

interface Bundle {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  price: number;
  isActive: boolean;
}

interface DirectOrderFormProps {
  product: Product;
  bundles?: Bundle[];
}

export function DirectOrderForm({ product, bundles = [] }: DirectOrderFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      city: "",
      address: "",
    },
  });

  const handleSelectBundle = (bundle: Bundle | null) => {
    setSelectedBundle(bundle);
    if (bundle) {
      setQuantity(bundle.quantity);
    } else {
      setQuantity(1);
    }
  };

  const totalPrice = selectedBundle
    ? selectedBundle.price
    : product.price * quantity;

  const displayQuantity = selectedBundle ? selectedBundle.quantity : quantity;

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await submitDirectOrder({
        productId: product.id,
        productName: product.name,
        price: selectedBundle ? selectedBundle.price / selectedBundle.quantity : product.price,
        quantity: displayQuantity,
        customerName: values.name,
        customerPhone: values.phone,
        customerAddress: values.address,
        customerCity: values.city,
        bundleName: selectedBundle?.name,
        bundlePrice: selectedBundle?.price,
      });

      if (result.success) {
        toast({
          title: "Commande enregistrée ! 🎉",
          description: result.message,
        });
        reset();
        setQuantity(1);
        setSelectedBundle(null);
      } else {
        toast({
          title: "Erreur",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-2 border-primary/20 shadow-lg bg-primary/5">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
          <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
          <span className="leading-tight">Achat Rapide <span className="hidden xs:inline">(Paiement à la livraison)</span></span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Remplissez ce formulaire pour commander ce produit immédiatement.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="direct-order-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Bundles */}
          {bundles.length > 0 && (
            <BundleCard
              bundles={bundles}
              productPrice={product.price}
              onSelectBundle={handleSelectBundle}
              selectedBundleId={selectedBundle?.id ?? null}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order-name">Nom Complet</Label>
              <Input
                id="order-name"
                placeholder="Ex: Jean Dupont"
                {...register("name")}
                className={
                  errors.name
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="order-phone">Téléphone</Label>
              <Input
                id="order-phone"
                placeholder="Ex: 6XXXXXXXX"
                {...register("phone")}
                className={
                  errors.phone
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.phone && (
                <p className="text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order-city">Ville</Label>
              <Input
                id="order-city"
                placeholder="Ex: Douala, Yaoundé..."
                {...register("city")}
                className={
                  errors.city
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.city && (
                <p className="text-xs text-destructive">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="order-address">Quartier / Adresse</Label>
              <Input
                id="order-address"
                placeholder="Ex: Bonapriso, Rue 123"
                {...register("address")}
                className={
                  errors.address
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.address && (
                <p className="text-xs text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {/* Quantity — disabled when bundle selected */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <Label className="text-xs sm:text-sm">Quantité</Label>
                <div className="flex items-center border rounded-md h-8 sm:h-9">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-r-none"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isSubmitting || !!selectedBundle}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-7 sm:w-8 text-center text-xs sm:text-sm font-medium">
                    {displayQuantity}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-l-none"
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    disabled={
                      quantity >= product.stock ||
                      isSubmitting ||
                      !!selectedBundle
                    }
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                {selectedBundle && (
                  <span className="text-[10px] sm:text-xs text-primary font-medium">
                    📦 {selectedBundle.name}
                  </span>
                )}
              </div>
              <div className="text-right self-end sm:self-auto">
                <span className="text-xs sm:text-sm text-muted-foreground mr-1 sm:mr-2">
                  Total:
                </span>
                <span className="text-lg sm:text-xl font-bold text-primary">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="px-4 sm:px-6">
        <Button
          type="submit"
          form="direct-order-form"
          disabled={isSubmitting || product.stock === 0}
          className="w-full h-10 sm:h-11 md:h-12 text-xs sm:text-sm md:text-base lg:text-lg font-bold transition-all hover:scale-[1.02] shadow-primary/20"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              <span className="text-xs sm:text-sm">Traitement...</span>
            </div>
          ) : (
            <>
              <ShoppingBag className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span>JE COMMANDE MAINTENANT</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
