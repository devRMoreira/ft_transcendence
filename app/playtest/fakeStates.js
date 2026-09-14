const card = (name, atk, def, spd, wis, instanceId) => ({
	id: `card-${name}`,
	name,
	rarity: "...",
	description: "...",
	imageUrl: "/cards/....png",
	atk,
	def,
	spd,
	wis,
	instanceId: instanceId || `inst-${name}`,
})

const yourHand = [card("Gold 2", 92, 44, 28, 8), card("Silver 4", 76, 20, 84, 18)]

const pool = [
	{ slotId: 0, claimedBy: null },
	{ slotId: 1, card: card("Platinum 3", 80, 24, 76, 16), claimedBy: "player1" },
	{ slotId: 2, claimedBy: null },
	{ slotId: 3, claimedBy: "player2" },
]

const round1_p1Wins = {
	round: 1,
	stat: "atk",
	plays: {
		player1: card("Gold 1", 10, 52, 12, 4, "hist-r1-p1"),
		player2: card("Silver 2", 92, 44, 52, 10, "hist-r1-p2"),
	},
	winner: "player1",
	roundPoints: 1,
}

const round2_tie = {
	round: 2,
	stat: "wis",
	plays: {
		player1: card("Platinum 4", 72, 16, 92, 20, "hist-r2-p1"),
		player2: card("Amethyst 5", 64, 16, 84, 20, "hist-r2-p2"),
	},
	winner: "tie",
	roundPoints: 1,
}

const round3_tie = {
	round: 3,
	stat: "def",
	plays: {
		player1: card("Gold 6", 60, 12, 92, 24, "hist-r3-p1"),
		player2: card("Silver 7", 52, 12, 20, 26, "hist-r3-p2"),
	},
	winner: "tie",
	roundPoints: 1,
}

const round2_p2Wins = {
	round: 2,
	stat: "spd",
	plays: {
		player1: card("Amethyst 2", 88, 40, 36, 10, "hist-r2b-p1"),
		player2: card("Gold 4", 76, 28, 60, 16, "hist-r2b-p2"),
	},
	winner: "player2",
	roundPoints: 1,
}

const round3_p1Wins = {
	round: 3,
	stat: "atk",
	plays: {
		player1: card("Platinum 1", 96, 40, 44, 8, "hist-r3b-p1"),
		player2: card("Silver 3", 84, 28, 68, 14, "hist-r3b-p2"),
	},
	winner: "player1",
	roundPoints: 1,
}

const round4_p1Wins = {
	round: 4,
	stat: "def",
	plays: {
		player1: card("Gold 7", 52, 10, 16, 28, "hist-r4-p1"),
		player2: card("Amethyst 6", 56, 8, 20, 26, "hist-r4-p2"),
	},
	winner: "player1",
	roundPoints: 1,
}

const round4_p2Wins = {
	round: 4,
	stat: "spd",
	plays: {
		player1: card("Silver 5", 68, 12, 20, 22, "hist-r4b-p1"),
		player2: card("Platinum 2", 88, 32, 60, 12, "hist-r4b-p2"),
	},
	winner: "player2",
	roundPoints: 1,
}

const round1_p2Wins = {
	round: 1,
	stat: "wis",
	plays: {
		player1: card("Gold 8", 44, 92, 32, 32, "hist-r1c-p1"),
		player2: card("Amethyst 4", 72, 24, 68, 18, "hist-r1c-p2"),
	},
	winner: "player2",
	roundPoints: 1,
}

const base = {
	id: "fake-match-id",
	player1Id: "fake-p1",
	player2Id: "fake-p2",
	winnerId: null,
	isVsAI: false,
	playedAt: new Date().toISOString(),
	you: "player1",
}

export const fakeStates = {
	choosing_youWon: {
		...base,
		status: "CHOOSING",
		state: { rollWinner: "player1" },
	},
	choosing_waiting: {
		...base,
		status: "CHOOSING",
		state: { rollWinner: "player2" },
	},
	drafting_yourTurn: {
		...base,
		status: "DRAFTING",
		state: {
			pool,
			turn: "player1",
			hands: { player1: yourHand, opponentHandCount: 3 },
			picksRemaining: { player1: 5, player2: 4 },
		},
	},
	drafting_waiting: {
		...base,
		status: "DRAFTING",
		state: {
			pool,
			turn: "player2",
			hands: { player1: yourHand, opponentHandCount: 3 },
			picksRemaining: { player1: 4, player2: 5 },
		},
	},
	playing_rolling: {
		...base,
		status: "PLAYING",
		state: {
			status: "rolling",
			round: 2,
			roundStat: null,
			carryOver: 0,
			scores: { player1: 0, player2: 1 },
			hands: { player1: yourHand, opponentHandCount: 2 },
			plays: { player1: null, player2: null },
			log: [round1_p1Wins],
		},
	},
	playing_yourTurnToPlay: {
		...base,
		status: "PLAYING",
		state: {
			status: "playing",
			round: 2,
			roundStat: "spd",
			carryOver: 0,
			scores: { player1: 1, player2: 0 },
			hands: { player1: yourHand, opponentHandCount: 2 },
			plays: { player1: null, player2: null },
			log: [round1_p1Wins],
		},
	},
	playing_waitingForOpponent: {
		...base,
		status: "PLAYING",
		state: {
			status: "playing",
			round: 2,
			roundStat: "spd",
			carryOver: 0,
			scores: { player1: 1, player2: 0 },
			hands: { player1: [yourHand[1]], opponentHandCount: 2 },
			plays: { player1: yourHand[0], player2: null },
			log: [round1_p1Wins],
		},
	},
	playing_opponentPlayedFirst: {
		...base,
		status: "PLAYING",
		state: {
			status: "playing",
			round: 2,
			roundStat: "spd",
			carryOver: 0,
			scores: { player1: 1, player2: 0 },
			hands: { player1: yourHand, opponentHandCount: 2 },
			plays: { player1: null, player2: true },
			log: [round1_p1Wins],
		},
	},
	playing_resolving: {
		...base,
		status: "PLAYING",
		state: {
			status: "readyToResolve",
			round: 2,
			roundStat: "spd",
			carryOver: 0,
			scores: { player1: 1, player2: 0 },
			hands: { player1: [yourHand[1]], opponentHandCount: 1 },
			plays: { player1: yourHand[0], player2: card("Silver 6", 60, 10, 24, 26, "inst-opp") },
			log: [round1_p1Wins],
		},
	},
	playing_withCarryover: {
		...base,
		status: "PLAYING",
		state: {
			status: "rolling",
			round: 3,
			roundStat: null,
			carryOver: 2,
			scores: { player1: 0, player2: 0 },
			hands: { player1: yourHand, opponentHandCount: 2 },
			plays: { player1: null, player2: null },
			log: [round2_tie, round3_tie].map((entry, i) => ({ ...entry, round: i + 1 })),
		},
	},
	playing_suddenDeath: {
		...base,
		status: "PLAYING",
		state: {
			status: "rolling",
			round: 6,
			roundStat: null,
			carryOver: 0,
			scores: { player1: 2, player2: 2 },
			hands: { player1: yourHand, opponentHandCount: 1 },
			plays: { player1: null, player2: null },
			log: [round1_p1Wins, round2_tie, round3_tie, round4_p2Wins],
		},
	},
	complete_won: {
		...base,
		status: "COMPLETE",
		winnerId: "fake-p1",
		state: {
			winner: "player1",
			scores: { player1: 3, player2: 1 },
			log: [round1_p1Wins, round2_p2Wins, round3_p1Wins, round4_p1Wins],
		},
	},
	complete_lost: {
		...base,
		status: "COMPLETE",
		winnerId: "fake-p2",
		state: {
			winner: "player2",
			scores: { player1: 1, player2: 3 },
			log: [round1_p2Wins, round2_p2Wins, round3_p1Wins, round4_p2Wins].map((entry, i) => ({
				...entry,
				round: i + 1,
			})),
		},
	},
}
