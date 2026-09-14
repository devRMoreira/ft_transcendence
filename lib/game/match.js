import { resolveRound } from "./round.js"
import { rollStat } from "./utils.js"

export function rollRoundStat(state) {
	if (state.status !== "rolling") return { ...state, error: "Not ready to roll a stat yet" }

	return {
		...state,
		roundStat: rollStat(),
		status: "playing",
		error: null,
	}
}

export function initMatch(draftRes) {
	const { hands, tokenHolder } = draftRes

	return {
		hands: { player1: [...hands.player1], player2: [...hands.player2] },
		round: 1,
		scores: { player1: 0, player2: 0 },
		roundStat: null,
		carryOver: 0,
		prioToken: tokenHolder,
		plays: { player1: null, player2: null },
		status: "rolling",
		log: [],
		error: null,
	}
}

function checkMatchWinner(state) {
	const { scores, round, prioToken } = state

	if (scores.player1 >= 3) return "player1"
	if (scores.player2 >= 3) return "player2"

	if (round > 6) {
		if (scores.player1 > scores.player2) return "player1"
		if (scores.player2 > scores.player1) return "player2"

		return prioToken
	}

	return null
}

export function resolveTurn(state) {
	const nextState = resolveRound(state)

	if (nextState.error) return nextState

	const winner = checkMatchWinner(nextState)

	return {
		...nextState,
		winner,
		status: winner ? "complete" : "rolling",
	}
}
