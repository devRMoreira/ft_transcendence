import { getPlayerRole } from "@/lib/game/authorize"
import { draftPick } from "@/lib/game/draft"
import { initMatch } from "@/lib/game/match"
import { sanitizeMatchForPlayer } from "@/lib/game/sanitize"
import { prisma } from "@/lib/prisma"

export async function POST(req, { params }) {
	const { id } = await params

	const match = await prisma.match.findUnique({ where: { id } })
	if (!match) return Response.json({ error: "Match not found" }, { status: 404 })

	const role = await getPlayerRole(match)
	if (!role) return Response.json({ error: "Not a player in this match" }, { status: 403 })

	if (match.status !== "DRAFTING")
		return Response.json({ error: "Not drafting" }, { status: 409 })

	const { slotId } = await req.json()
	const nextState = draftPick(match.state, role, slotId)

	if (nextState.error) return Response.json({ error: nextState.error }, { status: 400 })

	let updateData = { state: nextState }

	if (nextState.status === "complete") {
		const matchState = initMatch({ hands: nextState.hands, tokenHolder: nextState.tokenHolder })
		updateData = { status: "PLAYING", state: matchState }
	}

	const updated = await prisma.match.update({ where: { id: match.id }, data: updateData })

	return Response.json(sanitizeMatchForPlayer(updated, role))
}
