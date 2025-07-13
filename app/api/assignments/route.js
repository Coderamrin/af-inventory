import prisma from "@/utils/prismaDB";

export async function GET() {
  const assignments = await prisma.productAssignment.findMany({
    include: { product: true, seller: true }, // include related info if you want
  });

  return new Response(JSON.stringify(assignments), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request) {
  const { productId, sellerId, quantity } = await request.json();

  if (!productId || !sellerId || !quantity) {
    return new Response(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const existing = await prisma.productAssignment.findFirst({
    where: { productId, sellerId },
  });

  if (existing) {
    const updated = await prisma.productAssignment.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + Number(quantity) },
    });
    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    const assignment = await prisma.productAssignment.create({
      data: {
        productId,
        sellerId,
        quantity: Number(quantity),
      },
    });
    return new Response(JSON.stringify(assignment), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }
}
