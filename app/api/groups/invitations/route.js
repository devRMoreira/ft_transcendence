import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Not logged in" }, { status: 401 });

  const invitations = await prisma.groupInvitation.findMany({
    where: { inviteeId: session.user.id, status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: {
      group: { select: { id: true, name: true } },
      invitedBy: { select: { name: true, email: true } },
    },
  });

  return Response.json({ invitations });
}