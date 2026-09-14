import { auth } from "@/auth"

export async function getPlayerRole(match) {
	const session = await auth()
	const userId = session?.user?.id

	if (!userId) return null

	if (userId === match.player1Id) return "player1"

	if (userId === match.player2Id) return "player2"

	return null
}
