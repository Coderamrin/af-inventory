import prisma from "@/utils/prismaDB";

export async function GET(_, { params }) {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing seller ID" }), {
      status: 400,
    });
  }

  try {
    const seller = await prisma.user.findUnique({
      where: { id },
      include: {
        productAssignments: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });

    if (!seller || seller.role !== "SELLER") {
      return new Response(JSON.stringify({ error: "Seller not found" }), {
        status: 404,
      });
    }

    const totalAssignedValue = seller.productAssignments.reduce(
      (sum, a) => sum + a.quantity * a.product.price,
      0
    );
    const totalPaid = seller.payments.reduce((sum, p) => sum + p.amount, 0);

    const summary = {
      id: seller.id,
      name: seller.name,
      email: seller.email,
      totalAssignedValue,
      totalPaid,
      assignedProducts: seller.productAssignments,
      payments: seller.payments,
    };

    return new Response(JSON.stringify(summary), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
