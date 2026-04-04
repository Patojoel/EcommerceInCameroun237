import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import {
  formatPrice,
  formatDate,
  getStatusLabel,
  getStatusColor,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UpdateOrderStatus } from "@/components/admin/UpdateOrderStatus";
import {
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  Package,
  Calendar,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Détail Commande — Administration",
};

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

async function getOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, image: true } },
      items: {
        include: {
          product: {
            select: { name: true, slug: true, images: true, price: true },
          },
        },
      },
    },
  });
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const order = await getOrder(params.id);

  if (!order) notFound();

  const address = order.shippingAddress as any;
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="-ml-3 mb-2">
            <Link href="/admin/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux commandes
            </Link>
          </Button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold">
              Commande #{order.id.slice(-8).toUpperCase()}
            </h1>
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}
            >
              {getStatusLabel(order.status)}
            </span>
          </div>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex-shrink-0">
          <UpdateOrderStatus
            orderId={order.id}
            currentStatus={order.status}
          />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-4 w-4" />
              Client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Nom</p>
              <p className="font-medium">
                {order.user?.name ?? address?.name ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">
                {order.user?.email ?? address?.email ?? "—"}
              </p>
            </div>
            {address?.phone && (
              <div>
                <p className="text-sm text-muted-foreground">Téléphone</p>
                <p className="font-medium">{address.phone}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Livraison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Livraison
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {address ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Adresse</p>
                  <p className="font-medium">
                    {address.address ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ville</p>
                  <p className="font-medium">
                    {address.city ?? "—"}
                  </p>
                </div>
                {address.postalCode && (
                  <div>
                    <p className="text-sm text-muted-foreground">Code postal</p>
                    <p className="font-medium">{address.postalCode}</p>
                  </div>
                )}
                {address.country && (
                  <div>
                    <p className="text-sm text-muted-foreground">Pays</p>
                    <p className="font-medium">{address.country}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                Aucune adresse enregistrée
              </p>
            )}
          </CardContent>
        </Card>

        {/* Paiement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Paiement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-primary">
                {formatPrice(order.total)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Méthode</p>
              <p className="font-medium">
                {order.stripeId ? "Stripe" : "Paiement à la livraison"}
              </p>
            </div>
            {order.stripeId && (
              <div>
                <p className="text-sm text-muted-foreground">Stripe ID</p>
                <code className="text-xs bg-muted px-2 py-1 rounded block break-all">
                  {order.stripeId}
                </code>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Articles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-4 w-4" />
            Articles ({order.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 text-sm font-medium">
                    Produit
                  </th>
                  <th className="text-right p-3 text-sm font-medium">
                    Prix unitaire
                  </th>
                  <th className="text-center p-3 text-sm font-medium">
                    Quantité
                  </th>
                  <th className="text-right p-3 text-sm font-medium">
                    Sous-total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {item.product.images[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-sm">
                              🛍️
                            </div>
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/admin/products/${item.productId}`}
                            className="font-medium text-sm hover:text-primary transition-colors"
                          >
                            {item.product.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-right text-sm">
                      {formatPrice(item.price)}
                    </td>
                    <td className="p-3 text-center text-sm font-medium">
                      {item.quantity}
                    </td>
                    <td className="p-3 text-right font-bold text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/30">
                <tr>
                  <td colSpan={3} className="p-3 text-right font-medium">
                    Sous-total
                  </td>
                  <td className="p-3 text-right font-medium">
                    {formatPrice(subtotal)}
                  </td>
                </tr>
                <tr className="border-t">
                  <td
                    colSpan={3}
                    className="p-3 text-right font-bold text-lg"
                  >
                    Total
                  </td>
                  <td className="p-3 text-right font-bold text-lg text-primary">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <div>
                <p className="text-sm font-medium">Commande créée</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
            {order.status !== "PENDING" && (
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <div>
                  <p className="text-sm font-medium">
                    Statut actuel : {getStatusLabel(order.status)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(order.updatedAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
