import { playCard, resolveRound } from "./round.js"
import { rollStat } from "./utils.js"
import readline from "readline"


function rollRoundStat(state)
{
	if(state.status !== "rolling")
	{
		console.log("not rolling")
		return state
	}
	return{
		...state,
		roundStat: rollStat(),
		status: "playing"
	}
}

function initMatch(draftRes)
{
	const {hands, tokenHolder} = draftRes

	return {
		hands:{player1: [...hands.player1], player2: [...hands.player2]},
		round: 1,
		scores: {player1: 0, player2: 0},
		roundStat: null,
		carryOver: 0,
		prioToken: tokenHolder,
		plays: {player1: null, player2: null},
		status: "rolling",
		log: []
	}
}

function checkMatchWinner(state)
{
	const {scores, round, prioToken} = state

	if(scores.player1 >= 3)
		return "player1"
	if(scores.player2 >= 3)
		return "player2"

	if(round > 6)
	{
		if(scores.player1 > scores.player2)
			return "player1"
		if(scores.player2 > scores.player1)
			return "player2"

		return prioToken
	}

	return null
}

function resolveTurn(state)
{
	const nextState = resolveRound(state)

	const winner = checkMatchWinner(nextState)

	return {
		...nextState,
		winner,
		status: winner ? "complete" : "rolling"
	}
}


export async function playMatch(draftRes)
{
	let state = initMatch(draftRes)

	const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
	})


	while(state.status !== "complete")
	{
		if(state.status === "rolling")
		{

			if(state.round === 6)
				console.log("round 5 tie, overtime")


			state = rollRoundStat(state)

			console.log(`Round ${state.round}: rolled " + ${state.roundStat}`)
			console.log(`carryover points ${state.carryOver}`)
		}
		else if (state.status === "playing")
		{
			if(!state.plays.player1)
			{
				console.log("1's pick\n")
				console.log("Available cards")
				state.hands.player1.map((c, i) => console.log(`[${i}] ${c.name} (${state.roundStat.toUpperCase()}: ${c[state.roundStat]})`))

				const num = await new Promise((res) => rl.question("Choose card", res))
				const selected = state.hands.player1[Number(num)]

				if(selected)
					state = await playCard(state, "player1", selected.instanceId)
			}

			if(!state.plays.player2)
			{
				console.log("2's pick\n")
				console.log("Available cards")
				state.hands.player2.map((c, i) => console.log(`[${i}] ${c.name} (${state.roundStat.toUpperCase()}: ${c[state.roundStat]})`))

				const num = await new Promise((res) => rl.question("Choose card", res))
				const selected = state.hands.player2[Number(num)]

				if(selected)
					state = await playCard(state, "player2", selected.instanceId)

			}

		}
		else if(state.status === "readyToResolve")
		{
			state = resolveTurn(state)

			const lastLog = state.log[state.log.length - 1]
			const card1 = lastLog.plays.player1
			const card2 = lastLog.plays.player2

			console.log(`\n=== Round ${lastLog.round} Result ===`)
            console.log(`Player 1 played: ${card1.name} (${card1[lastLog.stat]})`)
            console.log(`Player 2 played: ${card2.name} (${card2[lastLog.stat]})`)
            console.log(`Outcome: ${lastLog.winner === "tie" ? "TIE!" : lastLog.winner + " won the round!"}`)
            console.log(`Scoreboard: Player 1 [${state.scores.player1}] - Player 2 [${state.scores.player2}]`)

			if(state.carryOver > 0)
				console.log(`next round worth ${state.carryOver} more points`)
		}
	}

	console.log("game over")
	rl.close()
	return state
}