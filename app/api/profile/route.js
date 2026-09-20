import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(request)
{
    const session = await auth()
    const sessionUserId = session?.user?.id
    
    const { searchParams } = new URL(request.url);
    const queryUserId = searchParams.get("targetUserId");

    const userId = queryUserId || sessionUserId

    if (!userId) 
        return Response.json({ error: "Unauthorized" }, { status: 401 })

    const userData = await prisma.user.findFirst({
        where: 
        { id: userId },
        select: {
            name: true,
            email: true,
            createdAt: true,   
        },
    });

    return Response.json({ userData });
}