import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Mon compte",
};

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/account");

  const accountLinks = [
    {
      href: "/account/orders",
      icon: Package,
      title: "Mes commandes",
      description: "Historique et suivi de vos commandes",
    },
    {
      href: "/account/profile",
      icon: User,
      title: "Mon profil",
      description: "Gérer vos informations personnelles",
    },
  ];

  return (
    <div className="container py-12 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mon compte</h1>
        <p className="text-muted-foreground mt-1">
          Bonjour, {session.user?.name ?? session.user?.email} 👋
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accountLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Card key={link.href} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{link.title}</CardTitle>
                    <CardDescription>{link.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href={link.href}>Accéder →</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
