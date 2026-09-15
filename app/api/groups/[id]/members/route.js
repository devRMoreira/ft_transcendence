import { auth } from "@/auth";
import { getAdminResponse } from "@/lib/group/authorize";
import { prisma } from "@/lib/prisma";

export async function POST(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not logged in" }, { status: 401 });

  const { id } = await params;
  const access = await getAdminResponse(id, session.user.id);
  if (access.error) return Response.json({ error: access.error }, { status: access.status });

  const { userId: identifier } = await request.json();
  if (!identifier) return Response.json({ error: "A valid user ID, name, or email is required" }, { status: 400 });

  const target = await prisma.user.findFirst({
    where: {
      OR: [{ id: identifier }, { name: identifier }, { email: identifier }],
    },
    select: { id: true },
  });
  if (!target) return Response.json({ error: "User not found" }, { status: 404 });
  if (target.id === session.user.id) return Response.json({ error: "You cannot invite yourself" }, { status: 400 });

  const existingMembership = await prisma.groupMembership.findUnique({ where: { userId: target.id } });
  if (existingMembership) return Response.json({ error: "User already belongs to a group" }, { status: 409 });

  const invitation = await prisma.groupInvitation.upsert({
    where: { groupId_inviteeId: { groupId: id, inviteeId: target.id } },
    update: { invitedById: session.user.id, status: "PENDING", updatedAt: new Date() },
    create: { groupId: id, inviteeId: target.id, invitedById: session.user.id },
  });

  return Response.json({ invitation }, { status: 201 });
}