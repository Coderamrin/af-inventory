import prisma from "@/utils/prismaDB";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "asc" },
    include: { assignments: true },
  });

  return new Response(JSON.stringify(products), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request) {
  const { name, price, totalStock, createdAt } = await request.json();
  if (!name || price == null || totalStock == null) {
    return new Response(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
    });
  }
  const product = await prisma.product.create({
    data: {
      name,
      price: Number(price),
      totalStock: Number(totalStock),
      createdAt: new Date(createdAt).toISOString(),
    },
  });
  return new Response(JSON.stringify(product), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
