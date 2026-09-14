import { prisma } from "../lib/prisma.js"
import bcrypt from "bcryptjs"

const DEV_USERS = [
	{ email: "dev1@example.com", password: "DevPassword123!", name: "Dev One" },
	{ email: "dev2@example.com", password: "DevPassword123!", name: "Dev Two" },
]

const cards = [
	{
		name: "Gold 1",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Gold",
		atk: 25,
		def: 13,
		spd: 14,
		wis: 2,
	},
	{
		name: "Gold 2",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Gold",
		atk: 23,
		def: 11,
		spd: 16,
		wis: 4,
	},
	{
		name: "Gold 3",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Gold",
		atk: 21,
		def: 9,
		spd: 18,
		wis: 6,
	},
	{
		name: "Gold 4",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Gold",
		atk: 19,
		def: 7,
		spd: 20,
		wis: 8,
	},
	{
		name: "Gold 5",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Gold",
		atk: 17,
		def: 5,
		spd: 22,
		wis: 10,
	},
	{
		name: "Gold 6",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Gold",
		atk: 15,
		def: 3,
		spd: 24,
		wis: 12,
	},
	{
		name: "Gold 7",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Gold",
		atk: 13,
		def: 25,
		spd: 2,
		wis: 14,
	},
	{
		name: "Gold 8",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Gold",
		atk: 11,
		def: 23,
		spd: 4,
		wis: 16,
	},
	{
		name: "Silver 1",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Silver",
		atk: 25,
		def: 11,
		spd: 17,
		wis: 3,
	},
	{
		name: "Silver 2",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Silver",
		atk: 23,
		def: 9,
		spd: 19,
		wis: 5,
	},
	{
		name: "Silver 3",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Silver",
		atk: 21,
		def: 7,
		spd: 21,
		wis: 7,
	},
	{
		name: "Silver 4",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Silver",
		atk: 19,
		def: 5,
		spd: 23,
		wis: 9,
	},
	{
		name: "Silver 5",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Silver",
		atk: 17,
		def: 3,
		spd: 25,
		wis: 11,
	},
	{
		name: "Silver 6",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Silver",
		atk: 15,
		def: 25,
		spd: 3,
		wis: 13,
	},
	{
		name: "Silver 7",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Silver",
		atk: 13,
		def: 23,
		spd: 5,
		wis: 15,
	},
	{
		name: "Amethyst 1",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Amethyst",
		atk: 24,
		def: 12,
		spd: 15,
		wis: 3,
	},
	{
		name: "Amethyst 2",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Amethyst",
		atk: 22,
		def: 10,
		spd: 17,
		wis: 5,
	},
	{
		name: "Amethyst 3",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Amethyst",
		atk: 20,
		def: 8,
		spd: 19,
		wis: 7,
	},
	{
		name: "Amethyst 4",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Amethyst",
		atk: 18,
		def: 6,
		spd: 21,
		wis: 9,
	},
	{
		name: "Amethyst 5",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Amethyst",
		atk: 16,
		def: 4,
		spd: 23,
		wis: 11,
	},
	{
		name: "Amethyst 6",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Amethyst",
		atk: 14,
		def: 2,
		spd: 25,
		wis: 13,
	},
	{
		name: "Amethyst 7",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Amethyst",
		atk: 12,
		def: 24,
		spd: 3,
		wis: 15,
	},
	{
		name: "Amethyst 8",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Amethyst",
		atk: 10,
		def: 22,
		spd: 5,
		wis: 17,
	},
	{
		name: "Platinum 1",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Platinum",
		atk: 24,
		def: 10,
		spd: 18,
		wis: 4,
	},
	{
		name: "Platinum 2",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Platinum",
		atk: 22,
		def: 8,
		spd: 20,
		wis: 6,
	},
	{
		name: "Platinum 3",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Platinum",
		atk: 20,
		def: 6,
		spd: 22,
		wis: 8,
	},
	{
		name: "Platinum 4",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Platinum",
		atk: 18,
		def: 4,
		spd: 24,
		wis: 10,
	},
	{
		name: "Platinum 5",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Platinum",
		atk: 16,
		def: 26,
		spd: 2,
		wis: 12,
	},
	{
		name: "Platinum 6",
		imageUrl: "/cards/....png",
		description: "...",
		rarity: "Platinum",
		atk: 14,
		def: 24,
		spd: 4,
		wis: 14,
	},
	{
		name: "Platinum 7",
		imageUrl: "/cards/....png",
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
