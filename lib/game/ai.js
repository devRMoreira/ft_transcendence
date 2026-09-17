export function pickDraftMove(draftState) {
	const openslots = draftState.pool.filter((slot) => !slot.claimedBy)
	if (openslots.length === 0) return null
	const choice = openslots[Math.floor(Math.random() * openslots.length)]
	return choice.slotId
}

export function pickPlayMove(hand, roundStat, context) {
	if (hand.length === 0) return null
	if (hand.length === 1) return hand[0].instanceId

	const decayRate = 0.6

	const valueGroups = new Map()

	for (const card of hand) {
		const value = card[roundStat]

		if (!valueGroups.has(value)) valueGroups.set(value, [])
		valueGroups.get(value).push(card)
	}

	const rankedValues = [...valueGroups.keys()].sort((a, b) => b - a)

	const { round, selfScore, carryOver = 0 } = context
	const roundPoints = 1 + carryOver
	const isSuddenDeath = round === 6
	const canWinMatch = selfScore != null && selfScore + roundPoints >= 3

	let chosenRank
	if (isSuddenDeath || canWinMatch) {
		chosenRank = 0
	} else {
		const weights = rankedValues.map((e, rank) => decayRate ** rank)
		const totalWeight = weights.reduce((sum, w) => sum + w, 0)
		let roll = Math.random() * totalWeight
		chosenRank = 0
		for (let i = 0; i < weights.length; i++) {
			roll -= weights[i]
			if (roll <= 0) {
				chosenRank = i
				break
			}
		}
	}

	const groupCards = valueGroups.get(rankedValues[chosenRank])
	const chosenCard = groupCards[Math.floor(Math.random() * groupCards.length)]
	return chosenCard.instanceId
}
