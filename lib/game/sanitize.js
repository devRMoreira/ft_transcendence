export function sanitizeMatchForPlayer(match, you) {
	if (!match.state) return { ...match, you }

	const opponent = you === "player1" ? "player2" : "player1"
	const state = { ...match.state }

	if (state.hands)
		state.hands = {
			[you]: state.hands[you] ?? [],
			opponentHandCount: state.hands[opponent]?.length ?? 0,
		}

	if (state.plays) {
		const youPlayed = Boolean(state.plays[you])
		const opponentPlayed = Boolean(state.plays[opponent])
		const bothPlayed = youPlayed && opponentPlayed

		state.plays = {
			[you]: state.plays[you] ?? null,
			[opponent]: bothPlayed ? state.plays[opponent] : opponentPlayed ? true : null,
		}
	}

	if (state.pool)
		state.pool = state.pool.map((slot) =>
			slot.claimedBy === you ? slot : { slotId: slot.slotId, claimedBy: slot.claimedBy }
		)

	return { ...match, state, you }
}
