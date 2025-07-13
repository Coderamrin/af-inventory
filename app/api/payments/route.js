// app/api/payments/route.js
import prisma from "@/utils/prismaDB";

export async function POST(request) {
  const { sellerId, amount } = await request.json();

  if (!sellerId || !amount) {
    return new Response(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
    });
  }

  const payment = await prisma.payment.create({
    data: {
      sellerId,
      amount: parseFloat(amount),
    },
  });

  return Response.json(payment, { status: 201 });
}
