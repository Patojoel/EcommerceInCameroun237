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
