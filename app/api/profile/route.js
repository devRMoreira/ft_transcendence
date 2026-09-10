import { prisma } from "@/lib/prisma"

// User Profile
// Backend - API route or server-side query returning the logged-in user's own info (name, email, join date).

// name
// email
// image placeholder?
// last seen 
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
            lastSeen: true,
            createdAt: true,   
        },
    });

    console.log(userInfo)
    
    return Response.json({ userInfo });
}

// model User {
//   id           String    @id @default(cuid())
//   name         String?   @unique
//   email        String    @unique
//   passwordHash String?   // null if a user only ever signs in via OAuth
//   image        String?   // here for scalability purposes
//   isBot        Boolean   @default(false) // to be used for AI matches, always true otherwise
//   lastSeen     DateTime? // bump on each authenticated request if you add online status later

//   createdAt DateTime @default(now())

//   accounts Account[] // OAuth related
//   sessions Session[]

//   friendRequestsSent     Friendship[] @relation("FriendRequester")
//   friendRequestsReceived Friendship[] @relation("FriendAddressee")

//   messagesSent     Message[] @relation("SentMessages")
//   messagesReceived Message[] @relation("ReceivedMessages")

//   groupsCreated Group[]           @relation("GroupCreator")
//   memberships   GroupMembership[]
//   posts         Post[]

//   matchesAsPlayer1 Match[] @relation("MatchPlayer1")
//   matchesAsPlayer2 Match[] @relation("MatchPlayer2")
//   matchesWon       Match[] @relation("MatchWinner")
// }