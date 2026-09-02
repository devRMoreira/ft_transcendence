import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

const DEV_USERS = [
  { email: "dev1@example.com", password: "DevPassword123!", name: "Dev One" },
  { email: "dev2@example.com", password: "DevPassword123!", name: "Dev Two" },
];

const cards =[
  {
    name: 'Silver 6',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 15,
    def: 25,
    spd: 3,
    wis: 13
  },
  {
    name: 'Silver 7',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 13,
    def: 23,
    spd: 5,
    wis: 15
  },
  {
    name: 'Amethyst 1',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 24,
    def: 12,
    spd: 15,
    wis: 3
  },
  {
    name: 'Amethyst 2',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 22,
    def: 10,
    spd: 17,
    wis: 5
  },
  {
    name: 'Amethyst 3',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 20,
    def: 8,
    spd: 19,
    wis: 7
  },
  {
    name: 'Gold 1',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '',
    atk: 25,
    def: 13,
    spd: 14,
    wis: 2
  },
  {
    name: 'Gold 2',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 23,
    def: 11,
    spd: 16,
    wis: 4
  },
  {
    name: 'Gold 3',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 21,
    def: 9,
    spd: 18,
    wis: 6
  },
  {
    name: 'Gold 4',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 19,
    def: 7,
    spd: 20,
    wis: 8
  },
  {
    name: 'Gold 5',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 17,
    def: 5,
    spd: 22,
    wis: 10
  },
  {
    name: 'Gold 6',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 15,
    def: 3,
    spd: 24,
    wis: 12
  },
  {
    name: 'Gold 7',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 13,
    def: 25,
    spd: 2,
    wis: 14
  },
  {
    name: 'Gold 8',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 11,
    def: 23,
    spd: 4,
    wis: 16
  },
  {
    name: 'Silver 1',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 25,
    def: 11,
    spd: 17,
    wis: 3
  },
  {
    name: 'Silver 2',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 23,
    def: 9,
    spd: 19,
    wis: 5
  },
  {
    name: 'Silver 3',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 21,
    def: 7,
    spd: 21,
    wis: 7
  },
  {
    name: 'Silver 4',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 19,
    def: 5,
    spd: 23,
    wis: 9
  },
  {
    name: 'Silver 5',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 17,
    def: 3,
    spd: 25,
    wis: 11
  },
  {
    name: 'Amethyst 4',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 18,
    def: 6,
    spd: 21,
    wis: 9
  },
  {
    name: 'Amethyst 5',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 16,
    def: 4,
    spd: 23,
    wis: 11
  },
  {
    name: 'Amethyst 6',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 14,
    def: 2,
    spd: 25,
    wis: 13
  },
  {
    name: 'Amethyst 7',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 12,
    def: 24,
    spd: 3,
    wis: 15
  },
  {
    name: 'Amethyst ',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 10,
    def: 22,
    spd: 5,
    wis: 17
  },
  {
    name: 'Platinum 1',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 24,
    def: 10,
    spd: 18,
    wis: 4
  },
  {
    name: 'Platinum 2',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 22,
    def: 8,
    spd: 20,
    wis: 6
  },
  {
    name: 'Platinum 3',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 20,
    def: 6,
    spd: 22,
    wis: 8
  },
  {
    name: 'Platinum 4',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 18,
    def: 4,
    spd: 24,
    wis: 10
  },
  {
    name: 'Platinum 5',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 16,
    def: 26,
    spd: 2,
    wis: 12
  },
  {
    name: 'Platinum 6',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 14,
    def: 24,
    spd: 4,
    wis: 14
  },
  {
    name: 'Platinum 7',
    imageUrl: '/cards/....png',
    description: '...',
    rarity: '...',
    atk: 12,
    def: 22,
    spd: 6,
    wis: 16
  }
]


async function seedDevUsers() {
  if (process.env.NODE_ENV === "production") return;

  for (const user of DEV_USERS) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {}, // leave it alone if it already exists
      create: {
        email: user.email,
        passwordHash,
        name: user.name,
      },
    });
  }

  console.log("Dev users ready:");
  for (const user of DEV_USERS) {
    console.log(`  ${user.email} / ${user.password}`);
  }
}

async function seedCards() {
  for (const card of cards) {
    await prisma.card.upsert({
      where: { name: card.name },
      update: card,
      create: card,
    });
  }
  console.log(`Seeded ${cards.length} cards.`);
}

async function main() {
  await seedDevUsers();
  await seedCards();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
