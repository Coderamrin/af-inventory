import prisma from "@/utils/prismaDB";

// export async function PUT(req, { params }) {
//   const { id } = params;
//   const { name, price, totalStock } = await req.json();

//   const updated = await prisma.product.update({
//     where: { id: Number(id) },
//     data: { name, price, totalStock },
//   });

//   return Response.json(updated);
// }

export async function PUT(req, { params }) {
  const { id } = params;
  const { name, price, totalStock } = await req.json();

  // Get existing product
  const existingProduct = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!existingProduct) {
    return new Response(JSON.stringify({ error: "Product not found" }), {
      status: 404,
    });
  }

  const updated = await prisma.product.update({
    where: { id: Number(id) },
    data: {
      name,
      price,
      totalStock: existingProduct.totalStock + Number(totalStock),
    },
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
