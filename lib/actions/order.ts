"use server";

export type DirectOrderData = {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  bundleName?: string;
  bundlePrice?: number;
};

export type BulkOrderItem = {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  bundleName?: string;
  bundlePrice?: number;
};

export type BulkOrderData = {
  items: BulkOrderItem[];
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
};

export async function submitDirectOrder(data: DirectOrderData) {
  try {
    const totalAmount = data.bundlePrice ?? data.price * data.quantity;

    const rawWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    const webhookUrl = rawWebhookUrl ? rawWebhookUrl.replace(/^["']|["']$/g, "").trim() : undefined;

    if (webhookUrl) {
      console.log("Envoi des données au Google Sheet...", {
        produit: data.productName,
        nom: data.customerName,
        total: totalAmount,
      });

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: new Date().toLocaleString("fr-FR"),
          produit: data.productName,
          quantite: data.quantity,
          montant_total: totalAmount,
          nom: data.customerName,
          telephone: data.customerPhone,
          adresse: data.customerAddress,
          ville: data.customerCity,
          bundle: data.bundleName ?? "—",
          status: "Commande non confirmer",
        }),
      });

      if (!response.ok) {
        console.error("Erreur lors de l'envoi au Google Sheet:", response.statusText);
      } else {
        console.log("Données envoyées avec succès !");
      }
    } else {
      console.warn("GOOGLE_SHEET_WEBHOOK_URL n'est pas défini dans le .env");
    }

    return { success: true, message: "Votre commande a été enregistrée avec succès !" };
  } catch (error) {
    console.error("Erreur commande directe:", error);
    return { success: false, message: "Une erreur est survenue lors de l'envoi." };
  }
}

export async function submitBulkDirectOrder(data: BulkOrderData) {
  try {
    const rawWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    const webhookUrl = rawWebhookUrl ? rawWebhookUrl.replace(/^["']|["']$/g, "").trim() : undefined;

    if (!webhookUrl) {
      console.warn("GOOGLE_SHEET_WEBHOOK_URL n'est pas défini dans le .env");
      return { success: true, message: "Commande enregistrée (webhook non configuré)." };
    }

    const now = new Date().toLocaleString("fr-FR");
    const orderId = `BULK-${Date.now()}`;

    // Build a single payload with all items
    const rows = data.items.map((item) => {
      const total = item.bundlePrice ?? item.price * item.quantity;
      return {
        date: now,
        orderId,
        produit: item.productName,
        quantite: item.quantity,
        montant_total: total,
        nom: data.customerName,
        telephone: data.customerPhone,
        adresse: data.customerAddress,
        ville: data.customerCity,
        bundle: item.bundleName ?? "—",
        status: "Commande non confirmer",
      };
    });

    console.log(`Envoi groupé de ${rows.length} produit(s) au Google Sheet...`);

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bulk: true, rows }),
    });

    if (!response.ok) {
      console.error("Erreur lors de l'envoi groupé au Google Sheet:", response.statusText);
      return { success: false, message: "Erreur lors de l'envoi de la commande." };
    }

    console.log("Envoi groupé réussi !");
    return {
      success: true,
      message: `${data.items.length} produit(s) commandé(s) avec succès !`,
    };
  } catch (error) {
    console.error("Erreur commande groupée:", error);
    return { success: false, message: "Une erreur est survenue lors de l'envoi." };
  }
}
