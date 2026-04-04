"use client";

import { Phone, Mail, MessageCircle, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BulkOrderCTAProps {
  productName: string;
}

export function BulkOrderCTA({ productName }: BulkOrderCTAProps) {
  const whatsappNumber = "+237600000000"; // Vous pourrez changer ce numéro dans .env plus tard
  const emailAddress = "contact@votre-boutique.com"; 
  const defaultMessage = `Bonjour, je souhaite commander le produit "${productName}" en grande quantité. Pouvez-vous me donner plus d'informations sur vos prix de gros ?`;

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/${whatsappNumber.replace("+", "")}?text=${encodeURIComponent(
        defaultMessage
      )}`,
      "_blank"
    );
  };

  const handleEmail = () => {
    window.open(
      `mailto:${emailAddress}?subject=Commande en gros - ${productName}&body=${encodeURIComponent(
        defaultMessage
      )}`
    );
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h3 className="text-lg font-bold flex items-center justify-center md:justify-start gap-2">
              <Package className="h-5 w-5 text-primary" />
              Commande en gros ?
            </h3>
            <p className="text-sm text-muted-foreground">
              Vous souhaitez commander ce produit en grande quantité ? Contactez-nous pour obtenir un devis personnalisé avec des tarifs dégressifs.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <Button
              onClick={handleWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Discuter sur WhatsApp
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleEmail} className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href={`tel:${whatsappNumber}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
