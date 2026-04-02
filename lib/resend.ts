import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail({
  to,
  orderNumber,
  total,
  items,
  shippingAddress,
}: {
  to: string;
  orderNumber: string;
  total: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  shippingAddress: { name: string; address: string; city: string };
}) {
  const itemsHtml = items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${new Intl.NumberFormat("fr-FR").format(item.price)} XAF</td>
        </tr>`
    )
    .join("");

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "noreply@ecommerce237.cm",
    to,
    subject: `Confirmation de commande #${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Commande confirmée ! 🎉</h1>
        <p>Bonjour ${shippingAddress.name},</p>
        <p>Nous avons bien reçu votre commande <strong>#${orderNumber}</strong>.</p>

        <h2>Récapitulatif</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 8px; text-align: left;">Produit</th>
              <th style="padding: 8px; text-align: center;">Qté</th>
              <th style="padding: 8px; text-align: right;">Prix</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 8px; font-weight: bold;">Total</td>
              <td style="padding: 8px; text-align: right; font-weight: bold;">${new Intl.NumberFormat("fr-FR").format(total)} XAF</td>
            </tr>
          </tfoot>
        </table>

        <h2>Adresse de livraison</h2>
        <p>${shippingAddress.name}<br>${shippingAddress.address}<br>${shippingAddress.city}</p>

        <p style="color: #666; font-size: 12px; text-align: center; margin-top: 40px;">
          EcommerceInCameroun237 — Votre boutique en ligne camerounaise
        </p>
      </div>
    `,
  });
}
