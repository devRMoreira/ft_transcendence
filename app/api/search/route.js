import { prisma } from "@/lib/prisma"

// const SORT_FIELDS = ["id", "name", "rarity", "atk", "def", "spd", "wis"]
// const SORT_DIRS = ["asc", "desc"]

//   id          String  @id @default(cuid())
//   name        String  @unique
//   imageUrl    String?
//   description String?
//   rarity      String?

//   atk          Int
//   def          Int
//   spd          Int
//   wis	       Int

export async function GET(request)
{
    const cards = await prisma.card.findMany()

    return Response.json({ cards });
}

