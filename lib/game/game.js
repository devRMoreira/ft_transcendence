import { prisma } from "../prisma.js"
import { draftHands } from "./draft.js"

const cards = await prisma.card.findMany()

async function startGame(cards)
{
	console.log(cards.length + ' cards')
	const draft = await draftHands(cards)

}





startGame(cards)


