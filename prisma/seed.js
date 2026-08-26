import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

const DEV_USERS = [
  { email: "dev1@example.com", password: "DevPassword123!", name: "Dev One" },
  { email: "dev2@example.com", password: "DevPassword123!", name: "Dev Two" },
];

const cards = [
  // { name: "...", type: "...", description: "...", imageUrl: "/cards/....png", atk: 0, def: 0, spd: 0, wis: 0 },
];

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
