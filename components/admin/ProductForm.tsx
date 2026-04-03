"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Upload, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { slugify } from "@/lib/utils";

const productSchema = z.object({
  name: z.string().min(2, "Minimum 2 caractères"),
  slug: z.string().min(2),
  description: z.string().min(10, "Minimum 10 caractères"),
  price: z.number().positive("Le prix doit être positif"),
  stock: z.number().int().min(0, "Le stock ne peut pas être négatif"),
  categoryId: z.string().min(1, "Sélectionnez une catégorie"),
  featured: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  categories: Array<{ id: string; name: string }>;
  product?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    featured: boolean;
    categoryId: string;
  };
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [newImageUrl, setNewImageUrl] = useState("");
  const isEdit = !!product;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      stock: product?.stock ?? 0,
      categoryId: product?.categoryId ?? "",
      featured: product?.featured ?? false,
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    register("name").onChange(e);
    if (!isEdit) {
      setValue("slug", slugify(name));
    }
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const payload = { ...data, images };

      const url = isEdit ? `/api/products/${product.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur serveur");
      }

      toast({
        title: isEdit ? "Produit mis à jour" : "Produit créé",
        description: `${data.name} a été ${isEdit ? "mis à jour" : "créé"} avec succès.`,
      });

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur serveur",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du produit *</Label>
              <Input
                id="name"
                placeholder="Boubou traditionnel"
                {...register("name")}
                onChange={handleNameChange}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                placeholder="boubou-traditionnel"
                {...register("slug")}
              />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Décrivez le produit..."
              rows={4}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Prix (XAF) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="25000"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                placeholder="10"
                {...register("stock", { valueAsNumber: true })}
              />
              {errors.stock && (
                <p className="text-sm text-destructive">{errors.stock.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select
                defaultValue={product?.categoryId}
                onValueChange={(value) => setValue("categoryId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-destructive">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="featured"
              defaultChecked={product?.featured}
              onCheckedChange={(checked) => setValue("featured", !!checked)}
            />
            <Label htmlFor="featured">
              Produit en vedette (affiché en page d&apos;accueil)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 items-center">
            <Input
              type="file"
              accept="image/*"
              className="flex-1"
              id="image-upload"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("file", file);

                try {
                  toast({
                    title: "Téléchargement en cours...",
                    description: "Veuillez patienter pendant l'envoi de l'image.",
                  });
                  
                  const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                  });
                  
                  if (!uploadRes.ok) throw new Error("Erreur lors de l'upload");
                  
                  const data = await uploadRes.json();
                  if (data.url) {
                    setImages([...images, data.url]);
                    toast({
                      title: "Succès",
                      description: "Image ajoutée avec succès.",
                    });
                  }
                } catch (error: any) {
                  toast({
                    title: "Erreur",
                    description: error.message || "Impossible d'uploader l'image",
                    variant: "destructive",
                  });
                } finally {
                  // Reset input
                  e.target.value = "";
                }
              }}
            />
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img}
                    alt={`Image ${idx + 1}`}
                    className="w-full aspect-square object-cover rounded-lg border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect fill='%23eee' width='100' height='100'/></svg>";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 h-6 w-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 text-xs bg-black/70 text-white px-1.5 py-0.5 rounded">
                      Principal
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {images.length === 0 && (
            <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
              <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Ajoutez des images depuis votre ordinateur</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isEdit ? "Mettre à jour" : "Créer le produit"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}
