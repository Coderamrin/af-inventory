import prisma from "@/utils/prismaDB";

export async function PATCH(request, { params }) {
  const { id } = params;
  const { newQuantity } = await request.json();

  const assignment = await prisma.productAssignment.findUnique({
    where: { id: Number(id) },
    include: { product: true },
  });

  if (!assignment) {
    return new Response(JSON.stringify({ error: "Assignment not found" }), {
      status: 404,
    });
  }

  const oldQty = assignment.quantity;
  const diff = newQuantity - oldQty;

  if (assignment.product.totalStock < diff) {
    return new Response(
      JSON.stringify({ error: "Not enough stock available" }),
      { status: 400 }
    );
  }

  // Update assignment quantity and product stock
  const updated = await prisma.$transaction([
    prisma.productAssignment.update({
      where: { id: Number(id) },
      data: { quantity: newQuantity },
    }),
    prisma.product.update({
      where: { id: assignment.productId },
      data: { totalStock: { decrement: diff } },
    }),
  ]);

  return new Response(JSON.stringify(updated[0]), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(request, { params }) {
  const { id } = params;

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
