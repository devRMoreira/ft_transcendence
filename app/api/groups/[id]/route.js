import { auth } from "@/auth";
import { getAdminResponse, getMembershipResponse } from "@/lib/group/authorize";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not logged in" }, { status: 401 });

  const { id } = await params;
  const access = await getMembershipResponse(id, session.user.id);
  if (access.error) return Response.json({ error: access.error }, { status: access.status });

  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      members: {
        orderBy: { joinedAt: "asc" },
        include: { user: { select: { id: true, name: true, image: true } } },
      },
      posts: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { id: true, name: true } } },
      },
    },
  });

  if (!group) return Response.json({ error: "Group not found" }, { status: 404 });
  return Response.json({ group, role: access.membership.role });
}

export async function PATCH(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not logged in" }, { status: 401 });

  const { id } = await params;
  const access = await getAdminResponse(id, session.user.id);
  if (access.error) return Response.json({ error: access.error }, { status: access.status });

  const body = await request.json();
  const data = {};

  if (body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim() || body.name.trim().length > 15) {
      return Response.json({ error: "Name is required and must be at most 15 characters" }, { status: 400 });
    }
    data.name = body.name.trim();
  }
  if (body.description !== undefined) {
    if (body.description !== null && (typeof body.description !== "string" || body.description.trim().length > 300)) {
      return Response.json({ error: "Description must be at most 300 characters" }, { status: 400 });
    }
    data.description = body.description?.trim() || null;
  }

  try {
    const group = await prisma.group.update({ where: { id }, data });
    return Response.json({ group });
  } catch (error) {
    if (error.code === "P2025") return Response.json({ error: "Group not found" }, { status: 404 });
    throw error;
  }
}

export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not logged in" }, { status: 401 });

  const { id } = await params;
  const access = await getAdminResponse(id, session.user.id);
  if (access.error) return Response.json({ error: access.error }, { status: access.status });

  try {
    await prisma.group.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    if (error.code === "P2025") return Response.json({ error: "Group not found" }, { status: 404 });
    throw error;
  }
}