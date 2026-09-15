import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const groupInclude = {
  members: {
    orderBy: { joinedAt: "asc" },
    include: { user: { select: { id: true, name: true, image: true } } },
  },
  posts: {
    orderBy: { createdAt: "desc" },
    include: { author: { select: { id: true, name: true } } },
  },
};

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not logged in" }, { status: 401 });

  const membership = await prisma.groupMembership.findUnique({
    where: { userId: session.user.id },
    include: { group: { include: groupInclude } },
  });

  return Response.json({ group: membership?.group ?? null, role: membership?.role ?? null });
}

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not logged in" }, { status: 401 });

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : null;

  if (!name || name.length > 15) {
    return Response.json({ error: "Name is required and must be at most 15 characters" }, { status: 400 });
  }
  if (description && description.length > 300) {
    return Response.json({ error: "Description must be at most 300 characters" }, { status: 400 });
  }

  try {
    const group = await prisma.$transaction(async (tx) => {
      const existingMembership = await tx.groupMembership.findUnique({
        where: { userId: session.user.id },
      });

      if (existingMembership) throw new Error("ALREADY_IN_GROUP");

      const createdGroup = await tx.group.create({
        data: {
          name,
          description: description || null,
          createdById: session.user.id,
        },
      });

      await tx.groupMembership.create({
        data: { groupId: createdGroup.id, userId: session.user.id, role: "ADMIN" },
      });

      return createdGroup;
    });

    return Response.json({ group }, { status: 201 });
  } catch (error) {
    if (error.message === "ALREADY_IN_GROUP") {
      return Response.json({ error: "You already belong to a group" }, { status: 409 });
    }
    if (error.code === "P2002") {
      return Response.json({ error: "A group with this name already exists" }, { status: 409 });
    }
    throw error;
  }
}