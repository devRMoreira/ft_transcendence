import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function getGroupMembership(groupId, userId, client = prisma) {
  return client.groupMembership.findUnique({
    where: {
      groupId_userId: { groupId, userId },
    },
  });
}

export async function getMembershipResponse(groupId, userId) {
  if (!userId) return { error: "Not logged in", status: 401 };

  const membership = await getGroupMembership(groupId, userId);
  if (!membership) return { error: "You are not a member of this group", status: 403 };

  return { membership };
}

export async function getAdminResponse(groupId, userId) {
  const result = await getMembershipResponse(groupId, userId);
  if (result.error) return result;

  if (result.membership.role !== "ADMIN") {
    return { error: "Only group admins can perform this action", status: 403 };
  }

  return result;
}