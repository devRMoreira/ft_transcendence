import { prisma } from "../prisma.js"
import { draftHands } from "./draft.js"
import { playMatch } from "./match.js"

const cards = await prisma.card.findMany()

const fakeDraft = {
  hands: {
	player1: [
    {
      id: 'cmtio5d9v0001749y1a9u38ef',
      name: 'Gold 2',
      imageUrl: '/cards/....png',
      description: '...',
      rarity: '...',
      atk: 23,
      def: 11,
      spd: 16,
      wis: 4,
      instanceId: 'c7bad299-41b0-4766-b3f3-ffabdcd7aa17'
    },
    {
      id: 'cmtio5dak000q749yktosckx2',
      name: 'Platinum 4',
      imageUrl: '/cards/....png',
      description: '...',
      rarity: '...',
      atk: 18,
      def: 4,
      spd: 24,
      wis: 10,
      instanceId: 'b76e3ad1-152c-4e3b-9fca-148a8d65df21'
    },
    {
      id: 'cmtio5dae000k749y6etixyid',
      name: 'Amethyst 6',
      imageUrl: '/cards/....png',
      description: '...',
      rarity: '...',
      atk: 14,
      def: 2,
      spd: 25,
      wis: 13,
      instanceId: '5e8da8ff-e3b3-46fd-acd9-6796c53a5360'
    },
    {
      id: 'cmtio5dab000g749yq0fquy44',
      name: 'Amethyst 2',
      imageUrl: '/cards/....png',
      description: '...',
      rarity: '...',
      atk: 22,
      def: 10,
      spd: 17,
      wis: 5,
      instanceId: '330feb90-7b10-48b1-ae60-c5b3eb3b67d1'
    },
    {
      id: 'cmtio5dah000n749y45i7mdt3',
      name: 'Platinum 1',
      imageUrl: '/cards/....png',
      description: '...',
      rarity: '...',
      atk: 24,
      def: 10,
      spd: 18,
      wis: 4,
      instanceId: '5a83c6b7-9740-4ce3-af0a-8335252ab0e6'
    },
    {
      id: 'cmtio5daa000f749ynblw1dz2',
      name: 'Amethyst 1',
      imageUrl: '/cards/....png',
      description: '...',
      rarity: '...',
      atk: 24,
      def: 12,
      spd: 15,
      wis: 3,
      instanceId: '9510e039-4970-457f-bfbd-5cafdb41c8b1'
    },
    {
      id: 'cmtio5d9w0002749yugkk57jk',
      name: 'Gold 3',
      imageUrl: '/cards/....png',
      description: '...',
      rarity: '...',
      atk: 21,
      def: 9,
      spd: 18,
      wis: 6,
      instanceId: '43254d51-f001-4be8-923f-a2201c540d00'
    }
  	],
	player2: [
    {
      id: 'cmtio5daj000p749yuaklu52e',
      name: 'Platinum 3',
      imageUrl: '/cards/....png',
      description: '...',
      rarity: '...',
      atk: 20,
      def: 6,
      spd: 22,
      wis: 8,
      instanceId: '7929d25c-b762-430d-adfe-eff9f93ac501'
    },
    {
      id: 'cmtio5daf000l749youdwb778',
      name: 'Amethyst 7',
      imageUrl: '/cards/....png',
      description: '...',
      rarity: '...',
      atk: 12,
      def: 24,
      spd: 3,
      wis: 15,
      instanceId: '05278974-46b1-4e68-b876-13e13329458e'
    },
    {
      id: 'cmtio5da00005749y8xvpph5j',
      name: 'Gold 6',
      imageUrl: '/cards/....png',
      description: '...',
      rarity: '...',
      atk: 15,
      def: 3,
      spd: 24,
      wis: 12,
      instanceId: '666c51a0-7931-4980-b262-d95a6301e489'
    },
    {
      id: 'cmtio5dab000g749yq0fquy44',
      name: 'Amethyst 2',
      imageUrl: '/cards/....png',
      description: '...',
      rarity: '...',
      atk: 22,
      def: 10,
      spd: 17,
      wis: 5,
      instanceId: 'ff380582-d9d6-4ab9-8936-966e5198047b'
    },
    {
      id: 'cmtio5dac000h749yb8e6tquz',
      name: 'Amethyst 3',
      imageUrl: '/cards/....png',
      description: '...',
      rarity: '...',
      atk: 20,
      def: 8,
      spd: 19,
      wis: 7,
      instanceId: 'e9e5c4b5-6fdb-419c-bb20-540b38eb9bda'
    },
    {
      id: 'cmtio5daa000f749ynblw1dz2',
      name: 'Amethyst 1',
      imageUrl: '/cards/....png',
      description: '...',
      rarity: '...',
      atk: 24,
      def: 12,
      spd: 15,
      wis: 3,
      instanceId: '5bfcffb3-1a6a-425d-9904-e97cd106f976'
    },
    {
      id: 'cmtio5dag000m749yj7bx0jxt',
      name: 'Amethyst ',
      imageUrl: '/cards/....png',
      description: '...',
      rarity: '...',
      atk: 10,
      def: 22,
      spd: 5,
      wis: 17,
      instanceId: 'b091ba8c-093f-44c1-ab66-fcc55eefac79'
    }
  	]
	},
  tokenHolder: 'player1'
}



async function startGame(cards)
{
	console.log(`${cards.length} cards`)
	const draftRes = await draftHands(cards)

	console.log(draftRes)
	console.log(draftRes.hands)

	const matchRes = await playMatch(draftRes)


}





startGame(cards)


