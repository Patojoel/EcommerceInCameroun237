import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  formatPrice,
  formatDate,
  getStatusLabel,
  getStatusColor,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UpdateOrderStatus } from "@/components/admin/UpdateOrderStatus";
import { Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "Commandes — Administration",
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
      },
    });
  } catch {
    orders = [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Commandes</h1>
        <p className="text-muted-foreground">
          {orders.length} commande{orders.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium">Commande</th>
              <th className="text-left p-4 text-sm font-medium">Client</th>
              <th className="text-left p-4 text-sm font-medium">Articles</th>
              <th className="text-right p-4 text-sm font-medium">Total</th>
              <th className="text-center p-4 text-sm font-medium">Statut</th>
              <th className="text-right p-4 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => {
              const address = order.shippingAddress as any;
              return (
                <tr key={order.id} className="hover:bg-muted/20">
                  <td className="p-4">
                    <p className="font-mono text-xs text-muted-foreground">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(order.createdAt)}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-sm">
                      {order.user?.name ?? address?.name ?? "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.user?.email ?? address?.email ?? "—"}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm">
                      {order.items.length} article
                      {order.items.length > 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {order.items.map((i: any) => i.product.name).join(", ")}
                    </p>
                  </td>
                  <td className="p-4 text-right font-bold">
                    {formatPrice(order.total)}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/orders/${order.id}`}>
                          <Eye className="h-3 w-3 mr-1" />
                          Détail
                        </Link>
                      </Button>
                      <UpdateOrderStatus
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Aucune commande pour l&apos;instant</p>
          </div>
        )}
      </div>
    </div>
  );
}
