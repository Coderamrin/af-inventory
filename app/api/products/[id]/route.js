import prisma from "@/utils/prismaDB";

export async function PUT(req, { params }) {
  const { id } = params;
  const { name, price, totalStock } = await req.json();

  const updated = await prisma.product.update({
    where: { id: Number(id) },
    data: { name, price, totalStock },
  });

  return Response.json(updated);
}

export async function DELETE(req, { params }) {
  const { id } = params;

  await prisma.product.delete({
    where: { id: Number(id) },
  });

  return Response.json({ success: true });
}
