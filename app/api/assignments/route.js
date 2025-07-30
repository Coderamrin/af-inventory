import prisma from "@/utils/prismaDB";

export async function GET() {
  try {
    const assignments = await prisma.productAssignment.findMany({
      include: {
        product: true,
        user: true,
      },
    });

    return new Response(JSON.stringify(assignments), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET /api/assignments error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch assignments" }),
      {
        status: 500,
      }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const userId = parseInt(body.userId, 10);
    const productId = parseInt(body.productId, 10);
    const quantity = Number(body.quantity);

    if (!userId || !productId || !quantity) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid fields" }),
        { status: 400 }
      );
    }

    // Fetch product and validate stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.totalStock < quantity) {
      return new Response(
        JSON.stringify({ error: "Not enough stock available" }),
        { status: 400 }
      );
    }

    const assignment = await prisma.productAssignment.create({
      data: {
        userId,
        productId,
        quantity,
      },
    });

    // Decrement the stock
    await prisma.product.update({
      where: { id: productId },
      data: {
        totalStock: {
          decrement: quantity,
        },
      },
    });

    return new Response(JSON.stringify(assignment), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error assigning product:", err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const userId = parseInt(body.userId, 10);
//     const productId = parseInt(body.productId, 10);
//     const quantity = Number(body.quantity);

//     if (!userId || !productId || !quantity) {
//       return new Response(
//         JSON.stringify({ error: "Missing or invalid fields" }),
//         { status: 400 }
//       );
//     }

//     // Fetch product and validate stock
//     const product = await prisma.product.findUnique({
//       where: { id: productId },
//     });

//     if (!product || product.totalStock < quantity) {
//       return new Response(
//         JSON.stringify({ error: "Not enough stock available" }),
//         { status: 400 }
//       );
//     }

//     // Check if assignment exists
//     const existing = await prisma.productAssignment.findFirst({
//       where: { userId, productId },
//     });

//     let assignment;

//     if (existing) {
//       assignment = await prisma.productAssignment.update({
//         where: { id: existing.id },
//         data: {
//           quantity: existing.quantity + quantity,
//         },
//       });
//     } else {
//       assignment = await prisma.productAssignment.create({
//         data: {
//           userId,
//           productId,
//           quantity,
//         },
//       });
//     }

//     // Decrement the stock
//     await prisma.product.update({
//       where: { id: productId },
//       data: {
//         totalStock: {
//           decrement: quantity,
//         },
//       },
//     });

//     return new Response(JSON.stringify(assignment), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (err) {
//     console.error("POST /api/assignments error:", err);
//     return new Response(JSON.stringify({ error: "Something went wrong" }), {
//       status: 500,
//     });
//   }
// }
