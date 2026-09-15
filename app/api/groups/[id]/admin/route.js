import { auth } from "@/auth";
import { getAdminResponse } from "@/lib/group/authorize";
import { prisma } from "@/lib/prisma";

export async function PATCH(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not logged in" }, { status: 401 });

  const { id } = await params;
  const access = await getAdminResponse(id, session.user.id);
  if (access.error) return Response.json({ error: access.error }, { status: access.status });

  const { userId } = await request.json();
  if (!userId || userId === session.user.id) return Response.json({ error: "A different member is required" }, { status: 400 });

  const target = await prisma.groupMembership.findUnique({ where: { userId } });
  if (!target || target.groupId !== id) return Response.json({ error: "Member not found" }, { status: 404 });

  await prisma.$transaction([
    prisma.groupMembership.update({ where: { userId: session.user.id }, data: { role: "MEMBER" } }),
    prisma.groupMembership.update({ where: { userId }, data: { role: "ADMIN" } }),
    prisma.group.update({ where: { id }, data: { createdById: userId } }),
  ]);

  return Response.json({ success: true });
}