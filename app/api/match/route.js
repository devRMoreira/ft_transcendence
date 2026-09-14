import { auth } from "@/auth"
import { decideRollWin } from "@/lib/game/draft"
import { prisma } from "@/lib/prisma"

export async function POST(req) {
	const session = await auth()
	if (!session?.user?.id) return Response.json({ error: "Not logged in" }, { status: 401 })

	const { opponentName, isVsAI } = await req.json()
	if (!opponentName) return Response.json({ error: "Opponent name is required" }, { status: 400 })

	const opp = await prisma.user.findUnique({ where: { name: opponentName } })
	if (!opp) return Response.json({ error: "User doens't exist" }, { status: 404 })

	if (opp.id === session.user.id)
		return Response.json({ error: "Can't play against yourself" }, { status: 400 })

	const rollWinner = decideRollWin()

	const match = await prisma.match.create({
		data: {
			player1Id: session.user.id,
			player2Id: opp.id,
			isVsAI: Boolean(isVsAI),
			status: "CHOOSING",
			state: { rollWinner },
		},
	})

	return Response.json(match)
}
