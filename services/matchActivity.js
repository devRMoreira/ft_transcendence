import { prisma } from "@/lib/prisma"
import { checkAIMove } from "./aiMatch"

const ACTIVE_STATUS = ["CHOOSING", "DRAFTING", "PLAYING"]
const STALE_LIMIT = 60000

function isStale(match, role, now) {
	const field = `${role}LastSeenAt`
	const seenAt = match[field]

	const lastActive = seenAt ? new Date(seenAt).getTime() : new Date(match.playedAt).getTime()

	return now - lastActive > STALE_LIMIT
}

export function isAbandoned(match) {
	const now = Date.now()
	const p1Stale = isStale(match, "player1", now)

	if (match.isVsAi) return p1Stale

	return p1Stale && isStale(match, "player2", now)
}

export async function checkAbandonedMatches() {
	const matches = await prisma.match.findMany({
		where: { status: { in: ACTIVE_STATUS } },
		orderBy: { playedAt: "asc" },
		take: 20,
	})

	const toAbandon = matches.filter((match) => isAbandoned(match))
	if (toAbandon.length === 0) return

	await prisma.match.updateMany({
		where: { id: { in: toAbandon.map((m) => m.id) } },
		data: { status: "ABANDONED" },
	})
}

async function updateTimestamps(match, role) {
	if (match.status === "COMPLETE" || match.status === "ABANDONED") return match

	const now = Date.now()
	const field = `${role}LastSeenAt`

	let updated = await prisma.match.update({
		where: { id: match.id },
		data: { [field]: new Date(now) },
	})

	if (updated.isVsAi) return updated

	const opp = role === "player1" ? "player2" : "player1"
	if (isStale(updated, opp, now)) {
		const winnerId = role === "player1" ? updated.player1Id : updated.player2Id
		updated = await prisma.match.update({
			where: { id: match.id },
			data: {
				status: "COMPLETE",
				winnerId,
				state: {
					...updated.state,
					status: "complete",
					winner: role,
					forfeited: true,
				},
			},
		})
	}

	return updated
}

export async function matchTick(match, role) {
	let current = await updateTimestamps(match, role)

	if (current.status === "COMPLETE" || current.status === "ABANDONED") return current
	checkAIMove(current)
	return current
}
