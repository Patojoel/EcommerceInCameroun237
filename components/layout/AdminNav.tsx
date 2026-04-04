"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ChevronRight,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const adminNavLinks = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/products",
    label: "Produits",
    icon: Package,
  },
  {
    href: "/admin/orders",
    label: "Commandes",
    icon: ShoppingCart,
  },
  {
    href: "/admin/customers",
    label: "Clients",
    icon: Users,
  },
  {
    href: "/admin/reviews",
    label: "Avis Clients",
    icon: MessageSquare,
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-muted/30 border-r flex flex-col">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-lg">
          <span>🔧</span>
          <span>Administration</span>
        </Link>
      </div>

      <Separator />

      <nav className="flex-1 p-4 space-y-1">
        {adminNavLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
              {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      <Separator />

      <div className="p-4 space-y-2">
        <Button variant="outline" asChild className="w-full justify-start">
          <Link href="/">
            ← Retour à la boutique
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </aside>
  );
}
