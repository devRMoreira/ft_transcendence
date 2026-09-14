function resolvePlay(card1, card2, stat) {
	if (card1[stat] > card2[stat]) return "player1"
	else if (card2[stat] > card1[stat]) return "player2"
	else return "tie"
}

export function resolveRound(state) {
	if (state.status !== "readyToResolve")
		return { ...state, error: "Both players haven't played yet" }

	const { player1: card1, player2: card2 } = state.plays
	const roundWinner = resolvePlay(card1, card2, state.roundStat)

	let carryOver = state.carryOver
	const scores = { ...state.scores }
	const roundPoints = 1 + carryOver
	const isOvertime = state.round === 6

	if (roundWinner === "tie") {
		if (isOvertime) {
			scores[state.prioToken] += roundPoints
			carryOver = 0
		} else carryOver += 1
	} else {
		scores[roundWinner] += roundPoints
		carryOver = 0
	}

	return {
		...state,
		scores,
		carryOver,
		round: state.round + 1,
		roundStat: null,
		status: "rolling",
		plays: { player1: null, player2: null },
		log: [
			...state.log,
			{
				round: state.round,
				stat: state.roundStat,
				plays: { player1: card1, player2: card2 },
				winner: roundWinner,
				roundPoints,
			},
		],
		error: null,
	}
}

export async function playCard(state, player, instanceId) {
	const cardIndex = state.hands[player].findIndex((c) => c.instanceId === instanceId)

	if (state.status !== "playing") return { ...state, error: "Not ready for plays yet" }

	if (state.plays[player]) return { ...state, error: `${player} already played this round` }

	if (cardIndex === -1) return { ...state, error: `${player} doesn't have that card` }

	const card = state.hands[player][cardIndex]

	const newHands = {
		...state.hands,
		[player]: state.hands[player].filter((e, i) => i !== cardIndex),
	}
	const newPlays = { ...state.plays, [player]: card }
	const bothPlayed = Boolean(newPlays.player1 && newPlays.player2)

	return {
		...state,
		hands: newHands,
		plays: newPlays,
		status: bothPlayed ? "readyToResolve" : "playing",
		error: null,
	}
}
