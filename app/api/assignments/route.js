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
    });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || product.totalStock < quantity) {
    return new Response(JSON.stringify({ error: "Not enough stock" }), {
      status: 400,
    });
  }

  // Check if assignment exists
  const existing = await prisma.productAssignment.findFirst({
    where: { productId, sellerId },
  });

  let updatedAssignment;

  if (existing) {
    updatedAssignment = await prisma.productAssignment.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + Number(quantity) },
    });
  } else {
    updatedAssignment = await prisma.productAssignment.create({
      data: {
        productId,
        sellerId,
        quantity: Number(quantity),
      },
    });
  }

  // Subtract quantity from total stock
  await prisma.product.update({
    where: { id: productId },
    data: {
      totalStock: {
        decrement: Number(quantity),
      },
    },
  });

  return new Response(JSON.stringify(updatedAssignment), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
