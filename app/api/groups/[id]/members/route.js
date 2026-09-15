import { auth } from "@/auth";
import { getAdminResponse } from "@/lib/group/authorize";
import { prisma } from "@/lib/prisma";

export async function POST(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not logged in" }, { status: 401 });

  const { id } = await params;
  const access = await getAdminResponse(id, session.user.id);
  if (access.error) return Response.json({ error: access.error }, { status: access.status });

  const { userId } = await request.json();
  if (!userId || userId === session.user.id) return Response.json({ error: "A valid userId is required" }, { status: 400 });

  const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!target) return Response.json({ error: "User not found" }, { status: 404 });

  const existingMembership = await prisma.groupMembership.findUnique({ where: { userId } });
  if (existingMembership) return Response.json({ error: "User already belongs to a group" }, { status: 409 });

  const invitation = await prisma.groupInvitation.upsert({
    where: { groupId_inviteeId: { groupId: id, inviteeId: userId } },
    update: { invitedById: session.user.id, status: "PENDING", updatedAt: new Date() },
    create: { groupId: id, inviteeId: userId, invitedById: session.user.id },
  });

  return Response.json({ invitation }, { status: 201 });
}