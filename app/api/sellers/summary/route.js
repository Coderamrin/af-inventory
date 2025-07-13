// app/api/sellers/summary/route.js (or .ts)
import prisma from "@/utils/prismaDB";

export async function GET() {
  try {
    const sellers = await prisma.seller.findMany({
      include: {
        assignments: {
          include: {
            product: true, // To get product.name etc
          },
        },
        payments: true, // To get payment history
      },
    });

    // Also, for each seller, calculate totalAssignedValue and totalPaid
    const sellersWithTotals = sellers.map((seller) => {
      const totalAssignedValue = seller.assignments.reduce(
        (sum, a) => sum + a.quantity * a.product.price,
        0
      );
      const totalPaid = seller.payments.reduce((sum, p) => sum + p.amount, 0);

      return {
        ...seller,
        totalAssignedValue,
        totalPaid,
      };
    });

    return new Response(JSON.stringify(sellersWithTotals), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
