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
  const { name, phone, email, password } = await request.json();

  if (!name || !phone || !email || !password) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "SELLER",
        seller: {
          create: {
            name,
            phone,
          },
        },
      },
      include: {
        seller: true,
      },
    });

    return new Response(JSON.stringify(user), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to create user and seller:", err);
    return new Response(JSON.stringify({ error: "User creation failed" }), {
      status: 500,
    });
  }
}
