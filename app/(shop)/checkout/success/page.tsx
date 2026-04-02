import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Package, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Commande confirmée !",
};

interface SuccessPageProps {
  searchParams: { orderId?: string };
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  let order = null;

  if (searchParams.orderId) {
    order = await prisma.order.findUnique({
      where: { id: searchParams.orderId },
      include: {
        items: {
          include: {
            product: { select: { name: true, images: true } },
          },
        },
      },
    });
  }

  return (
    <div className="container py-16 max-w-2xl text-center">
      <div className="flex justify-center mb-6">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-3">Commande confirmée !</h1>
      <p className="text-muted-foreground text-lg mb-8">
        Merci pour votre commande. Vous recevrez un email de confirmation
        prochainement.
      </p>

      {order && (
        <div className="text-left bg-muted/30 rounded-xl p-6 mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-sm text-muted-foreground">
              Commande #{order.id.slice(-8).toUpperCase()}
            </p>
            <p className="font-bold text-lg">{formatPrice(order.total)}</p>
          </div>

          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span className="text-muted-foreground">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/account/orders">
            <Package className="mr-2 h-5 w-5" />
            Voir mes commandes
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            Retour à l&apos;accueil
          </Link>
        </Button>
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground text-sm">
          Une question ? Contactez-nous à{" "}
          <a
            href="mailto:contact@ecommerce237.cm"
            className="text-primary hover:underline"
          >
            contact@ecommerce237.cm
          </a>
        </p>
      </div>
    </div>
  );
}
