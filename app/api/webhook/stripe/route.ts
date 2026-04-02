import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get("stripe-signature") ?? "";

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? "",
    );
  } catch (error) {
    console.error("Webhook signature error:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          const order = await prisma.order.update({
            where: { id: orderId },
            data: {
              status: "PAID",
              stripeId: session.id,
            },
            include: {
              items: { include: { product: true } },
              user: true,
            },
          });

          // Update stock
          for (const item of order.items) {
            await prisma.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            });
          }

          // Send confirmation email
          if (order.user?.email) {
            try {
              await sendOrderConfirmationEmail({
                to: order.user.email,
                orderNumber: order.id,
                total: order.total,
                items: order.items.map((item) => ({
                  name: item.product.name,
                  quantity: item.quantity,
                  price: item.price,
                })),
                shippingAddress: order.shippingAddress as any,
              });
            } catch (emailError) {
              console.error("Email error:", emailError);
            }
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as any;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: "CANCELLED" },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook handler error" },
      { status: 500 },
    );
  }
}
