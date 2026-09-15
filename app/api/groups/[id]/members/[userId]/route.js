import { auth } from "@/auth";
import { getAdminResponse } from "@/lib/group/authorize";
import { prisma } from "@/lib/prisma";

export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not logged in" }, { status: 401 });

  const { id, userId } = await params;
  const access = await getAdminResponse(id, session.user.id);
  if (access.error) return Response.json({ error: access.error }, { status: access.status });
  if (userId === session.user.id) return Response.json({ error: "Use the leave endpoint for yourself" }, { status: 400 });

  const membership = await prisma.groupMembership.findUnique({ where: { userId } });
  if (!membership || membership.groupId !== id) return Response.json({ error: "Member not found" }, { status: 404 });

  await prisma.groupMembership.delete({ where: { userId } });
  return Response.json({ success: true });
}