import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="font-bold text-xl flex items-center gap-2">
              <span>🇨🇲</span>
              <span>Ecommerce237</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Votre boutique en ligne de produits authentiques du Cameroun.
              Artisanat, mode et saveurs locales livrés chez vous.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-3">Boutique</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-foreground transition-colors">
                  Tous les produits
                </Link>
              </li>
              <li>
                <Link href="/categories/vetements" className="hover:text-foreground transition-colors">
                  Vêtements
                </Link>
              </li>
              <li>
                <Link href="/categories/artisanat" className="hover:text-foreground transition-colors">
                  Artisanat
                </Link>
              </li>
              <li>
                <Link href="/categories/alimentation" className="hover:text-foreground transition-colors">
                  Alimentation
                </Link>
              </li>
              <li>
                <Link href="/categories/accessoires" className="hover:text-foreground transition-colors">
                  Accessoires
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold mb-3">Mon compte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Connexion
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-foreground transition-colors">
                  Créer un compte
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-foreground transition-colors">
                  Mes commandes
                </Link>
              </li>
              <li>
                <Link href="/account/profile" className="hover:text-foreground transition-colors">
                  Mon profil
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold mb-3">Informations</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="flex items-center gap-1">
                  📍 Yaoundé, Cameroun
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1">
                  📞 +237 6XX XXX XXX
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1">
                  ✉️ contact@ecommerce237.cm
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1">
                  🕐 Lun-Ven 8h-18h
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            © {currentYear} EcommerceInCameroun237. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            <span>🔒 Paiement sécurisé</span>
            <span>🚚 Livraison rapide</span>
            <span>✅ Produits authentiques</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
