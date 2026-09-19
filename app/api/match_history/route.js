import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(request) {
    const session = await auth()
    const sessionUserId = session?.user?.id
    
    const { searchParams } = new URL(request.url);
    const queryUserId = searchParams.get("targetUserId");

    const userId = queryUserId || sessionUserId

    if (!userId) 
        return Response.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const matches = await prisma.match.findMany({
            where: {
                status: { in: ["COMPLETE", "ABANDONED"] },
                OR: [
                    { player1Id: userId },
                    { player2Id: userId }
                ]
            },
            orderBy: {
                playedAt: 'desc'
            },
            include: {
                player1: { select: { id: true, name: true } },
                player2: { select: { id: true, name: true } },
                winner: { select: { id: true, name: true } }
            }
        })

        return Response.json({
            userId,
            matches
        })
    }
    catch (error)
    {
        console.error("Match history route error:", error)
        return Response.json({ userId, matches: [], error: "Internal Server Error" }, { status: 500 })
    }
}