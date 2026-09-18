import { getPlayerRole } from "@/lib/game/authorize"
import { buildDraftState } from "@/lib/game/draft"
import { sanitizeMatchForPlayer } from "@/lib/game/sanitize"
import { prisma } from "@/lib/prisma"
import { matchTick } from "@/services/matchActivity"

export async function POST(req, { params }) {
	const { id } = await params

	const match = await prisma.match.findUnique({ where: { id } })
	if (!match) return Response.json({ error: "Match not found" }, { status: 404 })

	const role = await getPlayerRole(match)
	if (!role) return Response.json({ error: "Not a player in this match" }, { status: 403 })

	if (match.status !== "CHOOSING")
		return Response.json({ error: "Not waiting for a choice" }, { status: 409 })

	const { rollWinner } = match.state
	if (role !== rollWinner)
		return Response.json({ error: "You didn't win the roll, can't choose" }, { status: 403 })

	const { choice } = await req.json()
	const otherPlayer = rollWinner === "player1" ? "player2" : "player1"
	const firstPick = choice === "firstPick" ? rollWinner : otherPlayer
	const tokenHolder = choice === "firstPick" ? otherPlayer : rollWinner

	const cards = await prisma.card.findMany()

	const draftState = buildDraftState(cards, firstPick, tokenHolder)

	const updated = await prisma.match.update({
		where: { id: match.id },
		data: { status: "DRAFTING", state: draftState },
	})

	const current = await matchTick(updated, role)
	return Response.json(sanitizeMatchForPlayer(current, role))
}
