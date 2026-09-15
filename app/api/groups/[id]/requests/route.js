import { auth } from "@/auth";
import { getAdminResponse } from "@/lib/group/authorize";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not logged in" }, { status: 401 });

  const { id } = await params;
  const access = await getAdminResponse(id, session.user.id);
  if (access.error) return Response.json({ error: access.error }, { status: access.status });

  const requests = await prisma.groupJoinRequest.findMany({
    where: { groupId: id, status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
  });

  return Response.json({ requests });
}

export async function POST(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not logged in" }, { status: 401 });

  const { id } = await params;
  const existingMembership = await prisma.groupMembership.findUnique({ where: { userId: session.user.id } });
  if (existingMembership) return Response.json({ error: "You already belong to a group" }, { status: 409 });

  const group = await prisma.group.findUnique({ where: { id }, select: { id: true } });
  if (!group) return Response.json({ error: "Group not found" }, { status: 404 });

  const joinRequest = await prisma.groupJoinRequest.upsert({
    where: { groupId_userId: { groupId: id, userId: session.user.id } },
    update: { status: "PENDING", updatedAt: new Date() },
    create: { groupId: id, userId: session.user.id },
  });

  return Response.json({ request: joinRequest }, { status: 201 });
}