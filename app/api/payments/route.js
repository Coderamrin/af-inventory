import prisma from "@/utils/prismaDB";

export async function POST(request) {
  const { userId, amount } = await request.json();

  if (!userId || !amount) {
    return new Response(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
    });
  }

  const payment = await prisma.payment.create({
    data: {
      userId,
      amount: parseFloat(amount),
    },
  });

  return Response.json(payment, { status: 201 });
}
