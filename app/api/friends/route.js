import { prisma } from "@/lib/prisma"

export async function GET(request)
{
    try {
        const { friendParams } = new URL(request.url)
        const userId = friendParams.get("userId")
        const type = friendParams.get("type") 
        const targetId = friendParams.get("targetId") 

        if (!userId || !type)
            return Response.json( {error: "Missing info for GET"}, {status: 400} )
    
        if (type = "accepted")
        {
            const friendship = await prisma.friendship.findMany({
                where: {
                    status: "ACCEPTED",
                    OR: [
                        { requesterId: userId },
                        { addresseeId: userId },
                    ]
                },
                include: {
                    requester: { select: { id: true, name: true } },
                    addressee: { select: { id: true, name: true } },
                },
            })

            const friends = friendship.map(
                (f) => f.requesterId === userId ? f.addressee : f.requester
            )
            return Response.json({ data: friends })
        }

        else if (type = "sent")
        {
            const sent = await prisma.friendship.findMany({
                where: {
                    status: "PENDING",
                    requesterId: userId,
                },
                include: {
                    addressee: { select: { id: true, name: true } },
                },
            })

            return Response.json({ data: sent })
        }

        else if (type = "received")
        {
            const received = await prisma.friendship.findMany({
                where: {
                    status: "PENDING",
                    addresseeId: userId,
                },
                include: {
                    requester: { select: { id: true, name: true } },
                },
            })

            return Response.json({ data: received })
        }

        else if (type = "status")
        {
            const status = await prisma.friendship.findMany({
                where: {
                    OR: [
                        { requesterId: userId, addresseeId: targetId },
                        { requesterId: targetId, addresseeId: userId },
                    ],
                },
            })

            return Response.json({
                data: friendship ? { status: friendship.status } : { status: "NONE" },
            })
        }

        return Response.json( {error: "Invalid type parameter"}, {status: 400} )
    }
    catch {
        return Response.json( {error: "Internal server error"}, {status: 500} )
    }
}

export async function POST(request) // SEND FRIEND REQUEST
{
    try {
        const { requesterId, addresseeId } = await request.json();

        // must not be same sender and receiver
        if (requesterId === addresseeId)
            return Response.json( {error: "Can't friend yourself"}, {status: 400} )

        // can't have accepted or pending relationship
        const existingRelation = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { requesterId: userId, addresseeId: targetId },
                    { requesterId: targetId, addresseeId: userId },   
                ],
            },
        })

        if(existingRelation)
        {
            const errMsg = existingRelation.status === "ACCEPTED" ? "Already friends."
                : "Pending request already exists"

            return Response.json({ error: errMsg }, {status: 409}) // 409 Conflict
        }

        const newRequest = await prisma.friendship.create({
            data: { // status becomes PENDING by default
                requesterId,
                addresseeId,
            },
        });

        return Response.json({ success: true, friendship: newRequest });
    } 
    catch (error) {
        return Response.json({ error: "Failed to send request" }, { status: 500 });
    }
}

export async function PATCH(request) // ACCEPT FRIEND REQUEST
{
    try {
        const { requesterId, addresseeId } = await request.json();

        // MUST BE DONE BY ADDRESSEE - REQUIRES ACTION USER ID
        
        // Relation exists in the right order
        const existing = await prisma.friendship.findUnique({
            where: {
                requesterId_addresseeId: { requesterId, addresseeId },
            },
        });

        if (!existing) {
            return Response.json({ error: "Friend request not found." }, { status: 404 });
        }

        if (existing.status === "ACCEPTED") {
            return Response.json({ error: "Request already accepted." }, { status: 400 });
        }

        // success: update friendship
        const updated = await prisma.friendship.update({
            where: {
                requesterId_addresseeId: {
                    requesterId,
                    addresseeId,
                },
            },
            data: {
                status: "ACCEPTED",
            },
        });

        return Response.json({ success: true, friendship: updated });
    }
    catch (error) {
        return Response.json({ error: "Failed to accept request" }, { status: 500 });
    }
}

// ============================================================
// FRIENDS
// ============================================================

// enum FriendStatus {
//   PENDING
//   ACCEPTED
//   DECLINED
// }

// model Friendship {
//   id          String       @id @default(cuid())
//   requesterId String
//   addresseeId String
//   status      FriendStatus @default(PENDING)
//   createdAt   DateTime     @default(now())

//   requester User @relation("FriendRequester", fields: [requesterId], references: [id])
//   addressee User @relation("FriendAddressee", fields: [addresseeId], references: [id])

//   @@unique([requesterId, addresseeId])
// }