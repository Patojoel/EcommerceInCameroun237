import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  formatPrice,
  formatDate,
  getStatusLabel,
  getStatusColor,
} from "@/lib/utils";
import { PackageX, ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "Mes commandes",
};

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/account/orders");

  const userId = (session.user as any).id;

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: { select: { name: true, images: true, slug: true } },
        },
      },
    },
  });

  if (orders.length === 0) {
    return (
      <div className="container py-16 max-w-3xl text-center">
        <PackageX className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Aucune commande</h1>
        <p className="text-muted-foreground mb-8">
          Vous n&apos;avez pas encore passé de commande.
        </p>
        <Button asChild>
          <Link href="/products">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Commencer le shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">
        Mes commandes ({orders.length})
      </h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const address = order.shippingAddress as any;
          return (
            <div key={order.id} className="border rounded-xl p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-sm text-muted-foreground">
                    Commande #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">
                    {formatPrice(order.total)}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className="h-10 w-10 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                      {item.product.images[0] ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-lg">
                          🛍️
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="flex-1 hover:text-primary transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <span className="text-muted-foreground">
                      {item.quantity}x {formatPrice(item.price)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Shipping */}
              {address && (
                <p className="text-xs text-muted-foreground">
                  📍 Livraison à : {address.address}, {address.city},{" "}
                  {address.country}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
