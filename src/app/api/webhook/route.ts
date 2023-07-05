import { db } from "@/lib/prisma-db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressString = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ]
    .filter((c) => c !== null)
    .join(", ");

  await db.order.update({
    where: {
      id: session?.metadata?.orderId,
    },
    data: {
      isPaid: true,
      address: addressString,
      phone: session?.customer_details?.phone || "",
    },
    include: {
      orderItems: true,
    },
  });

  // const productIds = order.orderItems.map((orderItem) => orderItem.productId);

  // await db.product.updateMany({
  //   where: {
  //     id: {
  //       in: [...productIds],
  //     },
  //   },
  //   data: {
  //     isArchived: true,
  //   },
  // });

  return new NextResponse(null, { status: 200 });
}
