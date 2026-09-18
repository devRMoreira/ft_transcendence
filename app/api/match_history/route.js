import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) 
        return Response.json({ error: "Unauthorized" }, { status: 401 })

    const matches = await prisma.match.findMany({
        where: {
            status: "DRAFTING", //for sample
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

    return Response.json( matches )
}