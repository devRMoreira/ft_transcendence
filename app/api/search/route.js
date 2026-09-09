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

const ALLOWED_SORT_FIELDS = ["id_asc", "id_desc", "name_asc", "name_desc", "rarity_asc", "rarity_desc",
    "atk_asc", "atk_desc", "def_asc", "def_desc", "spd_asc", "spd_desc", "wis_asc", "wis_desc"]
const ALLOWED_RARITIES = ["Amethyst", "Platinum", "Gold", "Silver"]

export async function GET(request)
{
    try {
        const { searchParams } = new URL(request.url)

        const testSortBy = searchParams.get("sortBy")
        const testRarity = searchParams.get("rarity")
        const searchQuery = searchParams.get("searchQuery") || ""
        
        const sortBy = ALLOWED_SORT_FIELDS.includes(testSortBy) ? testSortBy : "name_asc"  
        const [sortField, sortOrder] = sortBy.split('_') // 'name_asc' to 'name' 'asc' 

        let rarityFilter = ALLOWED_RARITIES
        if (testRarity)
        {
            const parsedRarities = testRarity.split(",").filter((r) => ALLOWED_RARITIES.includes(r))
            if (parsedRarities.length > 0){
                rarityFilter = parsedRarities
            }
        }

        const cards = await prisma.card.findMany({
            where: {
                rarity: {
                    in: rarityFilter,
                },
                ...(searchQuery && {
                    name: {
                        contains: searchQuery,
                        mode: "insensitive",
                    },
                }),
            },
            orderBy: {
                [sortField]: sortOrder,
            },
        })

        // const cards = await prisma.card.findMany()
        return Response.json({ cards });
    }
    catch {
        return Response.json(
            {error: "Internal server error"},
            {status: 500}
        )
    }
}

 