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
const ALLOWED_RARITIES = ["amethyst", "platinum", "gold", "silver"]

export async function GET(request)
{
    //try
    const { searchParams } = new URL(request.URL)

    const testSortBy = searchParams.get("sortBy")
    const testRarity = searchParams.get("rarity")
    
    const sortBy = ALLOWED_SORT_FIELDS.includes(testSortBy) ? testSortBy : "name_asc"  
    const rarity = ALLOWED_RARITIES.includes(testRarity) ? testRarity : ["amethyst", "platinum", "gold", "silver"]

    const sortParam = sortBy.split('_') // 'name_asc' to 'name' 'asc' 

    const cards = await prisma.card.findMany({
        where: {
            rarity
        },
        orderBy: {
            [sortParam[0]]: sortParam[1],
        },
    })

    // const cards = await prisma.card.findMany()
    return Response.json({ cards });
    //catch
}

 