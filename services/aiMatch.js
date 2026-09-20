import { pickDraftMove, pickPlayMove } from "@/lib/game/ai"
import { buildDraftState, draftPick } from "@/lib/game/draft"
import { initMatch } from "@/lib/game/match"
import { playCard } from "@/lib/game/round"
import { prisma } from "@/lib/prisma"

const AI_ROLE = "player2"

export async function checkAIMove(match) {
	if (!match.isVsAI) return match

	let current = match

	while (true) {
		if (current.status === "CHOOSING" && current.state.rollWinner === AI_ROLE) {
			current = await advanceAIChoice(current)
			continue
		}
		if (current.status === "DRAFTING" && current.state.turn === AI_ROLE) {
			current = await advanceAIDraftPick(current)
			continue
		}
		if (
			current.status === "PLAYING" &&
			current.state.status === "playing" &&
			!current.state.plays[AI_ROLE]
		) {
			current = await advanceAIRoundPlay(current)
			continue
		}

		break
	}

	return current
}

async function advanceAIChoice(match) {
	const opp = "player1"
	const cards = await prisma.card.findMany()

	const choice = Math.floor(Math.random() * 2)
	let firstPick, tokenHolder

	if (choice === 0) {
		firstPick = AI_ROLE
		tokenHolder = opp
	} else {
		firstPick = opp
		tokenHolder = AI_ROLE
	}

	const draftState = buildDraftState(cards, firstPick, tokenHolder)

	return prisma.match.update({
		where: { id: match.id },
		data: { status: "DRAFTING", state: draftState },
	})
}

async function advanceAIDraftPick(match) {
	const slotId = pickDraftMove(match.state)
	if (slotId === null) return match

	const nextState = draftPick(match.state, AI_ROLE, slotId)
	if (nextState.error) return match

	if (nextState.status === "complete") {
		const matchState = initMatch({
			hands: nextState.hands,
			tokenHolder: nextState.tokenHolder,
		})

		return prisma.match.update({
			where: { id: match.id },
			data: { status: "PLAYING", state: matchState },
		})
	}

	return prisma.match.update({
		where: { id: match.id },
		data: { state: nextState },
	})
}

async function advanceAIRoundPlay(match) {
	const { hands, roundStat, round, scores, carryOver } = match.state

	const pickContext = {
		round,
		selfScore: scores[AI_ROLE],
		carryOver,
	}
	const instanceId = pickPlayMove(hands[AI_ROLE], roundStat, pickContext)
	if (instanceId === null) return match

	const nextState = await playCard(match.state, AI_ROLE, instanceId)
	if (nextState.error) return match

	return prisma.match.update({
		where: { id: match.id },
		data: { state: nextState },
	})
}
