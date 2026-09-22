import { prisma } from "../lib/prisma.js"
import bcrypt from "bcryptjs"

const DEV_USERS = [
	{ email: "dev1@example.com", password: "DevPassword123!", name: "Dev One" },
	{ email: "dev2@example.com", password: "DevPassword123!", name: "Dev Two" },
]

const cards = [
	{
		name: "Mimic",
		imageUrl: "/cards/mimic.png",
		description: "...",
		rarity: "Gold",
		atk: 25,
		def: 13,
		spd: 14,
		wis: 2,
	},
	{
		name: "Bush",
		imageUrl: "/cards/bush.png",
		description: "...",
		rarity: "Gold",
		atk: 23,
		def: 11,
		spd: 16,
		wis: 4,
	},
	{
		name: "Slime",
		imageUrl: "/cards/slime.png",
		description: "...",
		rarity: "Gold",
		atk: 21,
		def: 9,
		spd: 18,
		wis: 6,
	},
	{
		name: "Mummy",
		imageUrl: "/cards/mummy.png",
		description: "...",
		rarity: "Gold",
		atk: 19,
		def: 7,
		spd: 20,
		wis: 8,
	},
	{
		name: "Summer",
		imageUrl: "/cards/summer.png",
		description: "...",
		rarity: "Gold",
		atk: 17,
		def: 5,
		spd: 22,
		wis: 10,
	},
	{
		name: "Dessert",
		imageUrl: "/cards/dessert.png",
		description: "...",
		rarity: "Gold",
		atk: 15,
		def: 3,
		spd: 24,
		wis: 12,
	},
	{
		name: "Amiku",
		imageUrl: "/cards/amiku.png",
		description: "...",
		rarity: "Gold",
		atk: 13,
		def: 25,
		spd: 2,
		wis: 14,
	},
	{
		name: "Sludge",
		imageUrl: "/cards/sludge.png",
		description: "...",
		rarity: "Gold",
		atk: 11,
		def: 23,
		spd: 4,
		wis: 16,
	},
	{
		name: "Rats",
		imageUrl: "/cards/rats.png",
		description: "...",
		rarity: "Silver",
		atk: 25,
		def: 11,
		spd: 17,
		wis: 3,
	},
	{
		name: "Bats",
		imageUrl: "/cards/bats.png",
		description: "...",
		rarity: "Silver",
		atk: 23,
		def: 9,
		spd: 19,
		wis: 5,
	},
	{
		name: "Skeleton",
		imageUrl: "/cards/skeleton.png",
		description: "...",
		rarity: "Silver",
		atk: 21,
		def: 7,
		spd: 21,
		wis: 7,
	},
	{
		name: "Crab",
		imageUrl: "/cards/crab.png",
		description: "...",
		rarity: "Silver",
		atk: 19,
		def: 5,
		spd: 23,
		wis: 9,
	},
	{
		name: "Car",
		imageUrl: "/cards/car.png",
		description: "...",
		rarity: "Silver",
		atk: 17,
		def: 3,
		spd: 25,
		wis: 11,
	},
	{
		name: "What",
		imageUrl: "/cards/what.png",
		description: "...",
		rarity: "Silver",
		atk: 15,
		def: 25,
		spd: 3,
		wis: 13,
	},
	{
		name: "Camera",
		imageUrl: "/cards/camera.png",
		description: "...",
		rarity: "Silver",
		atk: 13,
		def: 23,
		spd: 5,
		wis: 15,
	},
	{
		name: "Knight",
		imageUrl: "/cards/knight.png",
		description: "...",
		rarity: "Amethyst",
		atk: 24,
		def: 12,
		spd: 15,
		wis: 3,
	},
	{
		name: "Alien",
		imageUrl: "/cards/alien.png",
		description: "...",
		rarity: "Amethyst",
		atk: 22,
		def: 10,
		spd: 17,
		wis: 5,
	},
	{
		name: "Pixie",
		imageUrl: "/cards/pixie.png",
		description: "...",
		rarity: "Amethyst",
		atk: 20,
		def: 8,
		spd: 19,
		wis: 7,
	},
	{
		name: "Minotaur",
		imageUrl: "/cards/minotaur.png",
		description: "...",
		rarity: "Amethyst",
		atk: 18,
		def: 6,
		spd: 21,
		wis: 9,
	},
	{
		name: "Worm",
		imageUrl: "/cards/worm.png",
		description: "...",
		rarity: "Amethyst",
		atk: 16,
		def: 4,
		spd: 23,
		wis: 11,
	},
	{
		name: "Suspicious",
		imageUrl: "/cards/suspicious.png",
		description: "...",
		rarity: "Amethyst",
		atk: 14,
		def: 2,
		spd: 25,
		wis: 13,
	},
	{
		name: "Hedge",
		imageUrl: "/cards/hedge.png",
		description: "...",
		rarity: "Amethyst",
		atk: 12,
		def: 24,
		spd: 3,
		wis: 15,
	},
	{
		name: "Passage",
		imageUrl: "/cards/passage.png",
		description: "...",
		rarity: "Amethyst",
		atk: 10,
		def: 22,
		spd: 5,
		wis: 17,
	},
	{
		name: "Ghost",
		imageUrl: "/cards/ghost.png",
		description: "...",
		rarity: "Platinum",
		atk: 24,
		def: 10,
		spd: 18,
		wis: 4,
	},
	{
		name: "Wolf",
		imageUrl: "/cards/wolf.png",
		description: "...",
		rarity: "Platinum",
		atk: 22,
		def: 8,
		spd: 20,
		wis: 6,
	},
	{
		name: "Snail",
		imageUrl: "/cards/snail.png",
		description: "...",
		rarity: "Platinum",
		atk: 20,
		def: 6,
		spd: 22,
		wis: 8,
	},
	{
		name: "The Cube",
		imageUrl: "/cards/cube.png",
		description: "...",
		rarity: "Platinum",
		atk: 18,
		def: 4,
		spd: 24,
		wis: 10,
	},
	{
		name: "Wii Board",
		imageUrl: "/cards/board.png",
		description: "...",
		rarity: "Platinum",
		atk: 16,
		def: 26,
		spd: 2,
		wis: 12,
	},
	{
		name: "Frogletics",
		imageUrl: "/cards/frogletics.png",
		description: "...",
		rarity: "Platinum",
		atk: 14,
		def: 24,
		spd: 4,
		wis: 14,
	},
	{
		name: "Nui",
		imageUrl: "/cards/nui.png",
		description: "...",
		rarity: "Platinum",
		atk: 12,
		def: 22,
		spd: 6,
		wis: 16,
	},
]

async function seedDevUsers() {
	if (process.env.NODE_ENV === "production") return {}

	const users = {}
	for (const user of DEV_USERS) {
		const passwordHash = await bcrypt.hash(user.password, 10)
		users[user.email] = await prisma.user.upsert({
			where: { email: user.email },
			update: {},
			create: {
				email: user.email,
				passwordHash,
				name: user.name,
			},
		})
	}

	console.log("Dev users ready:")
	for (const user of DEV_USERS) {
		console.log(`  ${user.email} / ${user.password}`)
	}

	return users
}

async function seedCards() {
	for (const card of cards) {
		await prisma.card.upsert({
			where: { name: card.name },
			update: card,
			create: card,
		})
	}
	console.log(`Seeded ${cards.length} cards.`)
}

async function seedSocialGraph(users) {
	const dev1 = users["dev1@example.com"]
	const dev2 = users["dev2@example.com"]
	if (!dev1 || !dev2) return

	// Friendship - accepted, so the friends list has an entry
	await prisma.friendship.upsert({
		where: {
			requesterId_addresseeId: { requesterId: dev1.id, addresseeId: dev2.id },
		},
		update: {},
		create: {
			requesterId: dev1.id,
			addresseeId: dev2.id,
			status: "ACCEPTED",
		},
	})

	// Some DMs
	const existingMessages = await prisma.message.findMany({
		where: { senderId: dev1.id, receiverId: dev2.id },
	})
	if (existingMessages.length === 0) {
		await prisma.message.create({
			data: { senderId: dev1.id, receiverId: dev2.id, content: "hello chat" },
		})
		await prisma.message.create({
			data: { senderId: dev2.id, receiverId: dev1.id, content: "is this real" },
		})
	}

	// group with both dev users, dev1 as admin and a pinned announcement.
	let group = await prisma.group.findFirst({ where: { name: "Dev Test Group" } })
	if (!group) {
		group = await prisma.group.create({
			data: {
				name: "Dev Test Group",
				description: "Seeded group for local testing",
				createdById: dev1.id,
			},
		})
	}

	await prisma.groupMembership.upsert({
		where: { groupId_userId: { groupId: group.id, userId: dev1.id } },
		update: {},
		create: { groupId: group.id, userId: dev1.id, role: "ADMIN" },
	})
	await prisma.groupMembership.upsert({
		where: { groupId_userId: { groupId: group.id, userId: dev2.id } },
		update: {},
		create: { groupId: group.id, userId: dev2.id, role: "MEMBER" },
	})

	const existingPosts = await prisma.post.findMany({ where: { groupId: group.id } })
	if (existingPosts.length === 0) {
		await prisma.post.create({
			data: {
				groupId: group.id,
				authorId: dev1.id,
				content: "Welcome - this is a pinned announcement.",
				isAnnouncement: true,
			},
		})
		await prisma.post.create({
			data: {
				groupId: group.id,
				authorId: dev2.id,
				content: "And this is a regular post.",
			},
		})
	}

	console.log(`Social graph ready - group: "${group.name}"`)
}

const AI_OPP_EMAIL = "totallyrealemail@ai.com"

async function seedAIOpponent() {
	await prisma.user.upsert({
		where: { email: AI_OPP_EMAIL },
		update: {},
		create: {
			email: AI_OPP_EMAIL,
			name: "AI Opponent",
			isBot: true,
		},
	})
	console.log("AI opponent user ready.")
}

async function main() {
	const users = await seedDevUsers()
	await seedCards()
	await seedSocialGraph(users)
	await seedAIOpponent()
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(() => prisma.$disconnect())
