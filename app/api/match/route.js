import { auth } from "@/auth"
import { decideRollWin } from "@/lib/game/draft"
import { prisma } from "@/lib/prisma"
import { checkAIMove } from "@/services/aiMatch"
import { checkAbandonedMatches, isAbandoned } from "@/services/matchActivity"

const ACTIVE_STATUS = ["CHOOSING", "DRAFTING", "PLAYING"]

export async function POST(req) {
	const session = await auth()
	if (!session?.user?.id) return Response.json({ error: "Not logged in" }, { status: 401 })

	await checkAbandonedMatches()

	const existing = await prisma.match.findFirst({
		where: {
			status: { in: ACTIVE_STATUS },
			OR: [{ player1Id: session.user.id }, { player2Id: session.user.id }],
		},
	})

	if (existing) {
		if (!isAbandoned(existing))
			return Response.json(
				{
					error: "There's already an active match",
					matchId: existing.id,
				},
				{ status: 409 }
			)

		await prisma.match.update({ were: { id: existing.id }, data: { status: "ABANDONED" } })
	}

	const { opponentName, isVsAI } = await req.json()
	let opp

	if (isVsAI) {
		opp = await prisma.user.findUnique({ where: { name: "AI Opponent" } })
	} else {
		if (!opponentName)
			return Response.json({ error: "Opponent name is required" }, { status: 400 })

		opp = await prisma.user.findUnique({ where: { name: opponentName } })
		if (!opp) return Response.json({ error: "User doens't exist" }, { status: 404 })

		if (opp.id === session.user.id)
			return Response.json({ error: "Can't play against yourself" }, { status: 400 })

		const isInMatch = await prisma.match.findFirst({
			where: {
				status: { in: ACTIVE_STATUS },
				OR: [{ player1Id: opp.id }, { player2Id: opp.id }],
			},
		})

		if (isInMatch)
			return Response.json({ error: "User is already in a match" }, { status: 409 })
	}

	const rollWinner = decideRollWin()

	const match = await prisma.match.create({
		data: {
			player1Id: session.user.id,
			player2Id: opp.id,
			isVsAI: Boolean(isVsAI),
			status: "CHOOSING",
			state: { rollWinner },
			player1LastSeenAt: new Date(),
		},
	})

	if (match.isVsAI) return Response.json(await checkAIMove(match))

	return Response.json(match)
}
