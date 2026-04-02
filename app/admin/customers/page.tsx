import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Clients — Administration",
};

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  let users: any[] = [];
  try {
    users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { orders: true } },
      },
    });
  } catch {
    users = [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Clients</h1>
        <p className="text-muted-foreground">
          {users.length} utilisateur{users.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium">Client</th>
              <th className="text-left p-4 text-sm font-medium">Email</th>
              <th className="text-center p-4 text-sm font-medium">Rôle</th>
              <th className="text-center p-4 text-sm font-medium">Commandes</th>
              <th className="text-right p-4 text-sm font-medium">Inscrit le</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/20">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {user.name?.charAt(0).toUpperCase() ??
                        user.email.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-medium">{user.name ?? "—"}</p>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {user.email}
                </td>
                <td className="p-4 text-center">
                  <Badge
                    variant={user.role === "ADMIN" ? "default" : "secondary"}
                  >
                    {user.role === "ADMIN" ? "Admin" : "Client"}
                  </Badge>
                </td>
                <td className="p-4 text-center font-medium">
                  {user._count.orders}
                </td>
                <td className="p-4 text-right text-sm text-muted-foreground">
                  {formatDate(user.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Aucun utilisateur pour l&apos;instant</p>
          </div>
        )}
      </div>
    </div>
  );
}
