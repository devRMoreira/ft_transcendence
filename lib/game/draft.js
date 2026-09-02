import { rollD6 } from "./utils.js"
import readline from "readline";


function decideFirstPick()
{
	let p1 = 0
	let p2 = 0

	while(p1 === p2)
	{
		p1 = rollD6()
		p2 = rollD6()
	}

	return p1 > p2 ? "player1" : "player2"
}


// fisher-yates shuffle algo
function shuffle(cards)
{
	const res = [...cards]

	for(let i = res.length - 1; i > 0; i--)
	{
		const j = Math.floor(Math.random() * (i + 1));

		[res[i], res[j]] = [res[j], res[i]]
	}

	return res
}

function initDraftPool(cards)
{
	const dupeCount = Math.floor(Math.random() * 4)
	const uniqueCount = 15 - (dupeCount * 2)

	const shuffled = shuffle(cards)

	const cardsToDupe = shuffled.slice(0, dupeCount)
	const uniqueCards = shuffled.slice(dupeCount, dupeCount + uniqueCount)

	const rawPool = shuffle([...cardsToDupe, ...cardsToDupe, ...uniqueCards])


	return rawPool.map((card, i) => ({
		slotId: i,
		card,
		claimedBy: null,
	}))
}

function buildDraftState(cards)
{
	return {
		pool: initDraftPool(cards),
		hands: {player1: [], player2: []},
		turn: decideFirstPick(),
		picksRemaining: {player1: 7, player2: 7},
		status: "drafting"
	}
}


function draftPick(state, player, slotId)
{

	const slot = state.pool.find((s) => s.slotId === slotId)
	if (state.status !== "drafting")
	 console.log("draft over")

	else if (state.turn !== player)
	 console.log("wrong turn")

	else if(!slot)
	 console.log("doesn't exist")

	else if(slot.claimedBy)
	 console.log("already claimed")

	else{
		const newPool = state.pool.map((s) => s.slotId === slotId ? {...s, claimedBy: player} : s)

		const newHands = {
			...state.hands,
			[player]: [...state.hands[player], slot.card],
			}

		const newPicksRemaining = {
			...state.picksRemaining,
			[player]: state.picksRemaining[player] - 1
		}

		const isOver = newPicksRemaining.player1 === 0 && newPicksRemaining.player2 === 0

		const nextPlayer = player === "player1" ? "player2" : "player1"

		return{
			...state,
			pool: newPool,
			hands:newHands,
			picksRemaining: newPicksRemaining,
			turn: isOver ? null : nextPlayer,
			state: isOver ? "complete" : "drafting"
		}
	}

	return state
}

export async function draftHands(cards)
{
	let state = buildDraftState(cards)

	console.log(state.turn + " goes first")

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		});

	while(state.status === "drafting")
	{
		console.log("Available cards")
		state.pool.map((e) => e.claimedBy ? null : console.log("Slot " + e.slotId))

		console.log(state.turn + "'s pick\n")
		const num = await new Promise((res) => rl.question("Choose card", res))

		state = draftPick(state, state.turn, Number(num))
	}

	rl.close();

	return state.hands
}
