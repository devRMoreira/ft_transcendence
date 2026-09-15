import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not logged in" }, { status: 401 });

  const { id } = await params;
  const { decision } = await request.json();
  if (decision !== "ACCEPTED" && decision !== "REJECTED") {
    return Response.json({ error: "Decision must be ACCEPTED or REJECTED" }, { status: 400 });
  }

  try {
    const invitation = await prisma.$transaction(async (tx) => {
      const found = await tx.groupInvitation.findUnique({ where: { id } });
      if (!found || found.inviteeId !== session.user.id || found.status !== "PENDING") throw new Error("INVITE_NOT_FOUND");

      if (decision === "ACCEPTED") {
        const membership = await tx.groupMembership.findUnique({ where: { userId: session.user.id } });
        if (membership) throw new Error("ALREADY_IN_GROUP");
        await tx.groupMembership.create({ data: { groupId: found.groupId, userId: session.user.id, role: "MEMBER" } });
      }

      return tx.groupInvitation.update({ where: { id }, data: { status: decision } });
    });

    return Response.json({ invitation });
  } catch (error) {
    if (error.message === "INVITE_NOT_FOUND") return Response.json({ error: "Invitation not found" }, { status: 404 });
    if (error.message === "ALREADY_IN_GROUP") return Response.json({ error: "You already belong to a group" }, { status: 409 });
    throw error;
  }
}