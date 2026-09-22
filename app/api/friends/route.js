import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"



export async function GET(request)
{
    try {
        const session = await auth()
        const userId = session?.user?.id
        const { searchParams } = new URL(request.url)
        const type = searchParams.get("type") 
        const targetId = searchParams.get("targetId") 

        if (!userId) 
            return Response.json({ error: "Unauthorized" }, { status: 401 })

        if (!type) 
            return Response.json({ success: false, error: "Missing type parameter" })
    
        if (type === "accepted")
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

        else if (type === "sent")
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

        else if (type === "received")
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

        else if (type === "status") {
            if (!targetId) {
                return Response.json({ success: false, error: "Missing targetId parameter" })
            }

            const friendship = await prisma.friendship.findFirst({
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

        return Response.json( { success: false, error: "invalid type parameter" } )
    }
    catch {
        return Response.json( {error: "Internal server error"}, {status: 500} )
    }
}

export async function POST(request) // SEND FRIEND REQUEST
{
    try {
        const session = await auth()
        const requesterId = session?.user?.id

        if (!requesterId) 
            return Response.json({ error: "Unauthorized" }, { status: 401 })

        const { recipient } = await request.json()

        if (!recipient) {
            return Response.json( { success: false, error: "Missing recipient" } )
        }

        const targetUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: recipient },
                    { name: recipient },
                ]
            }
        })

                if (!targetUser) {
            return Response.json( { success: false, error: "User not found" } )
        }

        const addresseeId = targetUser.id

        // must not be same sender and receiver
        if (requesterId === addresseeId)
            return Response.json( { success: false, error: "Can't friend self" } )

        // can't have accepted or pending relationship
        const existingRelation = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { requesterId: requesterId, addresseeId: addresseeId },
                    { requesterId: addresseeId, addresseeId: requesterId },   
                ],
            },
        })

        if(existingRelation)
        {
            const errMsg = existingRelation.status === "ACCEPTED"
                ? "Already friends."
                : "Pending request already exists"

            return Response.json({ success: false, error: errMsg })
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

export async function PATCH(request) {
    try {
        const session = await auth()
        const userId = session?.user?.id

        if (!userId) 
            return Response.json({ error: "Unauthorized" }, { status: 401 })

        const { requestId, addresseeId } = await request.json()
        const targetId = requestId || addresseeId

        if (!targetId) {
            return Response.json({ success: false, error: "Missing request identifier" })
            
        }
        
        const existing = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { id: targetId },
                    { requesterId: targetId, addresseeId: userId },
                ],
            },
        });

        if (!existing) {
            return Response.json({ success: false, error: "Friend request not found" });
        }

        // Only the addressee (recipient) can accept the request
        if (existing.addresseeId !== userId) {
            return Response.json( { success: false, error: "You are not the addressee" } );
        }

        if (existing.status === "ACCEPTED") {
            return Response.json( { success: false, error: "Already accepted" } );
        }

        const updated = await prisma.friendship.update({
            where: { id: existing.id },
            data: { status: "ACCEPTED" },
        });

        return Response.json({ success: true, friendship: updated });
    }
    catch (error) {
        return Response.json({ error: "Failed to accept request" }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const session = await auth()
        const userId = session?.user?.id

        if (!userId) 
            return Response.json({ error: "Unauthorized" }, { status: 401 })

        const { requestId, targetUserId, action } = await request.json()

        if (!requestId && !targetUserId) {
            return Response.json( { success: false, error: "Missing requestId" } )
        }

        const existing = requestId ? await prisma.friendship.findUnique({ where: { id: requestId }, })
            : await prisma.friendship.findFirst({
                where: {
                    OR: [
                        { requesterId: userId, addresseeId: targetUserId },
                        { requesterId: targetUserId, addresseeId: userId },
                    ],
                },
            })

        if (!existing) {
            return Response.json( { success: false, error: "No friendship/request found" } )
        }

        // Action-based permission checks
        if (action === "cancel" && existing.requesterId !== userId) {
            return Response.json( { success: false, error: "Not authorized to cancel this request" } )
        }

        if (action === "decline" && existing.addresseeId !== userId) {
            return Response.json( { success: false, error: "Not authorized to decline this request" } )
        }

        if (action === "remove" && existing.status !== "ACCEPTED"){
            return Response.json( { success: false, error: "Not currently friends" } ) 
        }

        // General fallback check: user must be either requester or addressee
        if (existing.requesterId !== userId && existing.addresseeId !== userId) {
            return Response.json( { success: false, error: "Unauthorized" } )
        }

        await prisma.friendship.delete({
            where: { id: existing.id },
        })

        return Response.json({ success: true })
    }
    catch (error) {
        return Response.json({ error: "Failed to delete request" }, { status: 500 })
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