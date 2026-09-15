import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not logged in" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.$transaction(async (tx) => {
      const membership = await tx.groupMembership.findUnique({ where: { userId: session.user.id } });
      if (!membership || membership.groupId !== id) throw new Error("MEMBER_NOT_FOUND");

      const remaining = await tx.groupMembership.findMany({
        where: { groupId: id, userId: { not: session.user.id } },
        orderBy: { joinedAt: "asc" },
      });

      await tx.groupMembership.delete({ where: { userId: session.user.id } });

      if (membership.role === "ADMIN" && remaining.length > 0) {
        await tx.groupMembership.update({ where: { userId: remaining[0].userId }, data: { role: "ADMIN" } });
        await tx.group.update({ where: { id }, data: { createdById: remaining[0].userId } });
      } else if (remaining.length === 0) {
        await tx.group.delete({ where: { id } });
      }
    });

    return Response.json({ success: true });
  } catch (error) {
    if (error.message === "MEMBER_NOT_FOUND") return Response.json({ error: "Membership not found" }, { status: 404 });
    throw error;
  }
}