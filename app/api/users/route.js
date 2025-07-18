// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prismaDB";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const sellerOnly = searchParams.get("sellerOnly");
  const include = searchParams.get("include");

  const includeFields = include?.split(",") || [];

  const includeObj = {};

  if (includeFields.includes("assignments")) {
    includeObj.assignments = {
      include: {
        product: true,
      },
    };
  }

  if (includeFields.includes("payments")) {
    includeObj.payments = true;
  }

  try {
    const users = await prisma.user.findMany({
      where: sellerOnly ? { role: "SELLER" } : {},
      include: Object.keys(includeObj).length ? includeObj : undefined,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
