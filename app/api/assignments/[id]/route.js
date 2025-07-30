import prisma from "@/utils/prismaDB";

// export async function PATCH(request, { params }) {
//   const { id } = params;
//   const { newQuantity, seller } = await request.json();

//   const assignment = await prisma.productAssignment.findUnique({
//     where: { id: Number(id) },
//     include: { product: true },
//   });

//   if (!assignment) {
//     return new Response(JSON.stringify({ error: "Assignment not found" }), {
//       status: 404,
//     });
//   }

//   const oldQty = assignment.quantity;
//   const diff = newQuantity - oldQty;

//   if (assignment.product.totalStock < diff) {
//     return new Response(
//       JSON.stringify({ error: "Not enough stock available" }),
//       { status: 400 }
//     );
//   }

//   // Update assignment quantity and product stock
//   const updated = await prisma.$transaction([
//     prisma.productAssignment.update({
//       where: { id: Number(id) },
//       data: { quantity: newQuantity },
//     }),
//     prisma.product.update({
//       where: { id: assignment.productId },
//       data: { totalStock: { decrement: diff } },
//     }),
//   ]);

//   return new Response(JSON.stringify(updated[0]), {
//     status: 200,
//     headers: { "Content-Type": "application/json" },
//   });
// }

export async function PATCH(req) {
  const body = await req.json();
  const { id, userId, productId, quantity } = body;

  console.log(id, userId, productId, quantity);

  if (!id || !userId || !productId || quantity == null) {
    return new Response(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
    });
  }

  const existing = await prisma.productAssignment.findUnique({
    where: { id },
    include: { product: true },
  });

  if (!existing) {
    return new Response(JSON.stringify({ error: "Assignment not found" }), {
      status: 404,
    });
  }

  const oldProductId = existing.productId;
  const oldQuantity = existing.quantity;

  // Revert stock from old assignment
  await prisma.product.update({
    where: { id: oldProductId },
    data: { totalStock: { increment: oldQuantity } },
  });

  // Check stock availability for the new product
  const newProduct = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!newProduct || newProduct.totalStock < quantity) {
    return new Response(
      JSON.stringify({ error: "Not enough stock for selected product" }),
      { status: 400 }
    );
  }

  // Deduct new quantity
  await prisma.product.update({
    where: { id: productId },
    data: { totalStock: { decrement: quantity } },
  });

  const updated = await prisma.productAssignment.update({
    where: { id },
    data: {
      userId,
      productId,
      quantity,
    },
  });

  return new Response(JSON.stringify(updated), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(request, { params }) {
  // const { id } = params;
  const id = Number(params.id);

  const assignment = await prisma.productAssignment.findUnique({
    where: { id: Number(id) },
  });

  if (!assignment) {
    return new Response(JSON.stringify({ error: "Assignment not found" }), {
      status: 404,
    });
  }

  // Restore stock when deleting assignment
  const result = await prisma.$transaction([
    prisma.productAssignment.delete({
      where: { id: Number(id) },
    }),
    prisma.product.update({
      where: { id: assignment.productId },
      data: {
        totalStock: {
          increment: assignment.quantity,
        },
      },
    }),
  ]);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
