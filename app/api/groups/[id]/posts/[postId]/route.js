import { auth } from "@/auth";
import { getAdminResponse, getMembershipResponse } from "@/lib/group/authorize";
import { prisma } from "@/lib/prisma";

export async function PATCH(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not logged in" }, { status: 401 });

  const { id, postId } = await params;
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.groupId !== id) return Response.json({ error: "Post not found" }, { status: 404 });

  const access = await getMembershipResponse(id, session.user.id);
  if (access.error) return Response.json({ error: access.error }, { status: access.status });

  if (post.isAnnouncement) {
    const adminAccess = await getAdminResponse(id, session.user.id);
    if (adminAccess.error) return Response.json({ error: adminAccess.error }, { status: adminAccess.status });
  } else if (post.authorId !== session.user.id) {
    return Response.json({ error: "Only the author can edit this post" }, { status: 403 });
  }

  if (Date.now() - post.createdAt.getTime() > 10 * 60 * 1000) {
    return Response.json({ error: "Posts can only be edited within 10 minutes of publishing" }, { status: 403 });
  }

  const body = await request.json();
  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!content || content.length > 2000) {
    return Response.json({ error: "Content is required and must be at most 2000 characters" }, { status: 400 });
  }

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: { content, editedAt: new Date() },
    include: { author: { select: { id: true, name: true } } },
  });

  return Response.json({ post: updatedPost });
}

export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not logged in" }, { status: 401 });

  const { id, postId } = await params;
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.groupId !== id) return Response.json({ error: "Post not found" }, { status: 404 });

  const access = await getMembershipResponse(id, session.user.id);
  if (access.error) return Response.json({ error: access.error }, { status: access.status });

  if (post.isAnnouncement) {
    const adminAccess = await getAdminResponse(id, session.user.id);
    if (adminAccess.error) return Response.json({ error: adminAccess.error }, { status: adminAccess.status });
  } else if (post.authorId !== session.user.id) {
    return Response.json({ error: "Only the author can delete this post" }, { status: 403 });
  }

  await prisma.post.delete({ where: { id: postId } });
  return Response.json({ success: true });
}