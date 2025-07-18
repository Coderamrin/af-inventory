// import prisma from "@/utils/prismaDB";

// export async function GET() {
//   try {
//     const assignments = await prisma.productAssignment.findMany({
//       include: {
//         product: true,
//         user: true, // assuming user model has role = SELLER
//       },
//     });

//     return new Response(JSON.stringify(assignments), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("GET /api/assignments error:", error);
//     return new Response(
//       JSON.stringify({ error: "Failed to fetch assignments" }),
//       {
//         status: 500,
//       }
//     );
//   }
// }

// export async function POST(request) {
//   try {
//     const { productId, userId, quantity } = await request.json();

//     if (!productId || !userId || !quantity) {
//       return new Response(JSON.stringify({ error: "Missing fields" }), {
//         status: 400,
//       });
//     }

//     const product = await prisma.product.findUnique({
//       where: { id: productId },
//     });

//     if (!product || product.totalStock < quantity) {
//       return new Response(JSON.stringify({ error: "Not enough stock" }), {
//         status: 400,
//       });
//     }

//     const existing = await prisma.productAssignment.findFirst({
//       where: { productId, userId },
//     });

//     let updatedAssignment;

//     if (existing) {
//       updatedAssignment = await prisma.productAssignment.update({
//         where: { id: existing.id },
//         data: {
//           quantity: existing.quantity + Number(quantity),
//         },
//       });
//     } else {
//       updatedAssignment = await prisma.productAssignment.create({
//         data: {
//           productId,
//           userId,
//           quantity: Number(quantity),
//         },
//       });
//     }

//     // Subtract from total stock
//     await prisma.product.update({
//       where: { id: productId },
//       data: {
//         totalStock: {
//           decrement: Number(quantity),
//         },
//       },
//     });

//     return new Response(JSON.stringify(updatedAssignment), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("POST /api/assignments error:", error);
//     return new Response(JSON.stringify({ error: "Failed to assign product" }), {
//       status: 500,
//     });
//   }
// }

import prisma from "@/utils/prismaDB";

export async function GET() {
  try {
    const assignments = await prisma.productAssignment.findMany({
      include: {
        product: true,
        user: true, // assuming user model has role = SELLER
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

    const assignment = await prisma.productAssignment.create({
      data: {
        userId,
        productId,
        quantity,
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
