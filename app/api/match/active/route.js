import { auth } from "@/auth"
import { getPlayerRole } from "@/lib/game/authorize"
import { sanitizeMatchForPlayer } from "@/lib/game/sanitize"
import { prisma } from "@/lib/prisma"
import { checkAbandonedMatches } from "@/services/matchActivity"

const ACTIVE_STATUS = ["CHOOSING", "DRAFTING", "PLAYING"]

export async function GET() {
	const session = await auth()
	if (!session?.user?.id) return Response.json({ error: "Not logged in" }, { status: 401 })

	await checkAbandonedMatches()

	const match = await prisma.match.findFirst({
		where: {
			status: { in: ACTIVE_STATUS },
			OR: [{ player1Id: session.user.id }, { player2Id: session.user.id }],
		},
	})

	if (!match) return Response.json({ active: false })

	const role = await getPlayerRole(match)
	return Response.json({ active: true, match: sanitizeMatchForPlayer(match, role) })
}
