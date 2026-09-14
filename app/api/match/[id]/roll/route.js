import { getPlayerRole } from "@/lib/game/authorize"
import { rollRoundStat } from "@/lib/game/match"
import { sanitizeMatchForPlayer } from "@/lib/game/sanitize"
import { prisma } from "@/lib/prisma"

export async function POST(req, { params }) {
	const { id } = await params

	const match = await prisma.match.findUnique({ where: { id } })
	if (!match) return Response.json({ error: "Match not found" }, { status: 404 })

	const role = await getPlayerRole(match)
	if (!role) return Response.json({ error: "Not a player in this match" }, { status: 403 })

	if (match.status !== "PLAYING")
		return Response.json({ error: "Match isn't in progress" }, { status: 409 })

	const nextState = rollRoundStat(match.state)
	if (nextState.error) return Response.json({ error: nextState.error }, { status: 400 })

	const updated = await prisma.match.update({
		where: { id: match.id },
		data: { state: nextState },
	})

	return Response.json(sanitizeMatchForPlayer(updated, role))
}
