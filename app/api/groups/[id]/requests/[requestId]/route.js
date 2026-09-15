import { auth } from "@/auth";
import { getAdminResponse } from "@/lib/group/authorize";
import { prisma } from "@/lib/prisma";

export async function PATCH(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not logged in" }, { status: 401 });

  const { id, requestId } = await params;
  const access = await getAdminResponse(id, session.user.id);
  if (access.error) return Response.json({ error: access.error }, { status: access.status });

  const { decision } = await request.json();
  if (decision !== "ACCEPTED" && decision !== "REJECTED") {
    return Response.json({ error: "Decision must be ACCEPTED or REJECTED" }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const joinRequest = await tx.groupJoinRequest.findUnique({ where: { id: requestId } });
      if (!joinRequest || joinRequest.groupId !== id || joinRequest.status !== "PENDING") {
        throw new Error("REQUEST_NOT_FOUND");
      }

      if (decision === "REJECTED") {
        return tx.groupJoinRequest.update({ where: { id: requestId }, data: { status: decision } });
      }

      const existingMembership = await tx.groupMembership.findUnique({ where: { userId: joinRequest.userId } });
      if (existingMembership) throw new Error("ALREADY_IN_GROUP");

      await tx.groupMembership.create({
        data: { groupId: id, userId: joinRequest.userId, role: "MEMBER" },
      });
      return tx.groupJoinRequest.update({ where: { id: requestId }, data: { status: decision } });
    });

    return Response.json({ request: result });
  } catch (error) {
    if (error.message === "REQUEST_NOT_FOUND") return Response.json({ error: "Request not found" }, { status: 404 });
    if (error.message === "ALREADY_IN_GROUP") return Response.json({ error: "User already belongs to a group" }, { status: 409 });
    throw error;
  }
}