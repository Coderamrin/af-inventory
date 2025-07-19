import { NextResponse } from "next/server";
import prisma from "@/utils/prismaDB";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userIdParam = searchParams.get("userId");

  const where = userIdParam
    ? { userId: parseInt(userIdParam) } // Convert to Int here
    : {};

  const payments = await prisma.payment.findMany({
    where,
    include: {
      user: true,
    },
  });

  return Response.json(payments);
}

// POST /api/payments
export async function POST(req) {
  try {
    const { userId, amount } = await req.json();

    if (!userId || !amount) {
      return new NextResponse(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: parseFloat(amount),
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("POST /payments error:", error);
    return new NextResponse("Failed to create payment", { status: 500 });
  }
}
