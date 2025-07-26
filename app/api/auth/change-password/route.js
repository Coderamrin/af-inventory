import { hash } from "bcryptjs";
import prisma from "@/utils/prismaDB";

export async function PUT(req) {
  const { newPassword, email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const hashedPassword = await hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  return new Response("Password updated successfully", { status: 200 });
}
