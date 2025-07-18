import prisma from "@/utils/prismaDB";

export async function GET() {
  try {
    const sellers = await prisma.user.findMany({
      where: { role: "SELLER" },
      include: {
        assignments: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });

    const sellersWithTotals = sellers.map((seller) => {
      const totalAssignedValue = seller.assignments.reduce(
        (sum, a) => sum + a.quantity * a.product.price,
        0
      );
      const totalPaid = seller.payments.reduce((sum, p) => sum + p.amount, 0);

      return {
        id: seller.id,
        name: seller.name,
        email: seller.email,
        totalAssignedValue,
        totalPaid,
      };
    });

    return new Response(JSON.stringify(sellersWithTotals), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
