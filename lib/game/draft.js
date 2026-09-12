import { rollD6 } from "./utils.js"
import crypto from "crypto"

export function decideRollWin() {
	let p1 = 0
	let p2 = 0

	while (p1 === p2) {
		p1 = rollD6()
		p2 = rollD6()
	}

	return p1 > p2 ? "player1" : "player2"
}

// fisher-yates shuffle algo
function shuffle(cards) {
	const res = [...cards]

	for (let i = res.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))

		;[res[i], res[j]] = [res[j], res[i]]
	}

	return res
}

function initDraftPool(cards) {
	const dupeCount = Math.floor(Math.random() * 4)
	const uniqueCount = 15 - dupeCount * 2

	const shuffled = shuffle(cards)

	const cardsToDupe = shuffled.slice(0, dupeCount)
	const uniqueCards = shuffled.slice(dupeCount, dupeCount + uniqueCount)

	const rawPool = shuffle([...cardsToDupe, ...cardsToDupe, ...uniqueCards])

	return rawPool.map((card, i) => ({
		slotId: i,
		card: {
			...card,
			instanceId: crypto.randomUUID(),
		},
		claimedBy: null,
	}))
}

export function buildDraftState(cards, firstPick, tokenHolder) {
	return {
		pool: initDraftPool(cards),
		hands: { player1: [], player2: [] },
		turn: firstPick,
		tokenHolder: tokenHolder,
		picksRemaining: { player1: 7, player2: 7 },
		status: "drafting",
		error: null,
	}
}

export function draftPick(state, player, slotId) {
	const slot = state.pool.find((s) => s.slotId === slotId)

	if (state.status !== "drafting") return { ...state, error: "Draft phase is over" }

	if (state.turn !== player) return { ...state, error: "It's not your turn" }

	if (!slot) return { ...state, error: "That slot doesn't exist" }

	if (slot.claimedBy) return { ...state, error: "That card is already claimed" }

	const newPool = state.pool.map((s) => (s.slotId === slotId ? { ...s, claimedBy: player } : s))

	const newHands = {
		...state.hands,
		[player]: [...state.hands[player], slot.card],
	}

	const newPicksRemaining = {
		...state.picksRemaining,
		[player]: state.picksRemaining[player] - 1,
	}

	const isOver = newPicksRemaining.player1 === 0 && newPicksRemaining.player2 === 0

	const nextPlayer = player === "player1" ? "player2" : "player1"

	return {
		...state,
		pool: newPool,
		hands: newHands,
		picksRemaining: newPicksRemaining,
		turn: isOver ? null : nextPlayer,
		status: isOver ? "complete" : "drafting",
		error: null,
	}
}
