import { getPlayerRole } from "@/lib/game/authorize"
import { sanitizeMatchForPlayer } from "@/lib/game/sanitize"
import { prisma } from "@/lib/prisma"

export async function GET(req, { params }) {
	const { id } = await params

	const match = await prisma.match.findUnique({ where: { id } })

	if (!match) return Response.json({ error: "Match not found" }, { status: 404 })

	const role = await getPlayerRole(match)
	if (!role) return Response.json({ error: "Not a player in this match" }, { status: 403 })

	return Response.json(sanitizeMatchForPlayer(match, role))
}
