import { prisma } from "@/lib/prisma"

// name
// email
// image placeholder?
// joined on 
// friends 
// messages 
// recent games / match history

export async function GET(request)
{
    const userInfo = await prisma.user.findFirst({
        select: {
            name: true,
            email: true,
            createdAt: true,   
        },
    });

    console.log(userInfo)
    
    return Response.json({ userInfo });
}