import prisma from "@/utils/prismaDB";

export async function GET() {
  const sellers = await prisma.seller.findMany({
    include: { assignments: true, payments: true },
  });
  return new Response(JSON.stringify(sellers), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request) {
  const { name } = await request.json();
  if (!name) {
    return new Response(JSON.stringify({ error: "Missing name" }), {
      status: 400,
    });
  }
  const seller = await prisma.seller.create({ data: { name } });
  return new Response(JSON.stringify(seller), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
