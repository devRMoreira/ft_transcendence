import { auth } from "@/auth";
import { getMembershipResponse } from "@/lib/group/authorize";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not logged in" }, { status: 401 });

  const { id } = await params;
  const access = await getMembershipResponse(id, session.user.id);
  if (access.error) return Response.json({ error: access.error }, { status: access.status });

  const posts = await prisma.post.findMany({
    where: { groupId: id },
    orderBy: [{ isAnnouncement: "desc" }, { createdAt: "desc" }],
    include: { author: { select: { id: true, name: true } } },
  });

  return Response.json({ posts });
}

export async function POST(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not logged in" }, { status: 401 });

  const { id } = await params;
  const access = await getMembershipResponse(id, session.user.id);
  if (access.error) return Response.json({ error: access.error }, { status: access.status });

  const body = await request.json();
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const isAnnouncement = body.isAnnouncement === true;

  if (!content || content.length > 2000) {
    return Response.json({ error: "Content is required and must be at most 2000 characters" }, { status: 400 });
  }
  if (isAnnouncement && access.membership.role !== "ADMIN") {
    return Response.json({ error: "Only group admins can create announcements" }, { status: 403 });
  }
// Remove the last comment. This function do not save the announcement for future logs!
// If want future logs, change function logic.
  const post = await prisma.$transaction(async (transaction) => {
    const createdPost = await transaction.post.create({
      data: { groupId: id, authorId: session.user.id, content, isAnnouncement },
      include: { author: { select: { id: true, name: true } } },
    });

    if (isAnnouncement) {
      const announcements = await transaction.post.findMany({
        where: { groupId: id, isAnnouncement: true },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        select: { id: true },
      });

      const announcementsToDelete = announcements.slice(0, -3).map((announcement) => announcement.id);
      if (announcementsToDelete.length > 0) {
        await transaction.post.deleteMany({ where: { id: { in: announcementsToDelete } } });
      }
    }

    return createdPost;
  });

  return Response.json({ post }, { status: 201 });
}