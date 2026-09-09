import { prisma } from "@/lib/prisma"

//   id          String  @id @default(cuid())
//   name        String  @unique
//   imageUrl    String?
//   description String?
//   rarity      String?

//   atk          Int
//   def          Int
//   spd          Int
//   wis	       Int

const ALLOWED_SORT_FIELDS = ["id", "name", "rarity", "atk", "def", "spd", "wis"]
const ALLOWED_SORT_DIRS = ["asc", "desc"]
const ALLOWED_RARITIES = ["amethyst", "platinum", "gold", "silver"]

export async function GET(request)
{
    //try
    const { searchParams } = new URL(request.URL)

    const testSortBy = searchParams.get("sortBy")
    const testOrder = searchParams.get("order")
    const testRarity = searchParams.get("rarity")
    
    const sortBy = ALLOWED_SORT_FIELDS.includes(testSortBy) ? testSortBy : "id"
    const order = ALLOWED_SORT_DIRS.includes(testOrder) ? testOrder : "asc"
    const rarity = ALLOWED_RARITIES.includes(testRarity)

    const cards = await prisma.card.findMany({
        where: {
            
        },
        orderBy: {
            [sortBy]: order,
        },
    })

    // const cards = await prisma.card.findMany()
    return Response.json({ cards });
    //catch
}

 