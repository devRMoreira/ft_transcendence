import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

// get list of messages with various users, with most recent last messages in each being the sorting order

async function checkIsFriend(receiverId, senderId) {
    const friendship = await prisma.friendship.findFirst({
        where: {
            status: "ACCEPTED",
            OR: [
                { requesterId: receiverId, addresseeId: senderId },
                { requesterId: senderId, addresseeId: receiverId },
            ],
        },
    })
    return !!friendship
}

async function getActiveFriendIds(userId) {
    const friendships = await prisma.friendship.findMany({
        where: {
            status: "ACCEPTED",
            OR: [
                { requesterId: userId },
                { addresseeId: userId },
            ],
        },
        select: {
            requesterId: true,
            addresseeId: true,
        },
    })

    return friendships.map((f) =>
        f.requesterId === userId ? f.addresseeId : f.requesterId
    )
}

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
            return Response.json( { success: false, error: "Missing fetch type" } )

        if (type === "conversations")
        {
            const friendIds = await getActiveFriendIds(userId)

            if (friendIds.length === 0) {
                return Response.json({ data: [] })
            }

            const latestMessageList = await prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: userId, receiverId: { in: friendIds } },
                        { receiverId: userId, senderId: { in: friendIds } },
                    ]
                },
                orderBy: { createdAt: "desc" },
                include: {
                    sender: { select: { id: true, name: true } },
                    receiver: { select: { id: true, name: true } },
                },
            })

            const MessageListMap = new Map()

            for (const msg of latestMessageList)
            {
                const partner = msg.senderId === userId ? msg.receiver : msg.sender

                if (!MessageListMap.has(partner.id)) {
                    MessageListMap.set(partner.id, {
                        partner,
                        lastMessage: {
                            id: msg.id,
                            content: msg.content,
                            createdAt: msg.createdAt,
                            readAt: msg.readAt,
                            senderId: msg.senderId,
                            receiverId: msg.receiverId,
                        },
                    })
                }
            }

            return Response.json({ data: Array.from(MessageListMap.values()) })
        }

        else if (type === "history") 
        {
            if (!targetId) {
                return Response.json( { success: false, error: "Missing targetId parameter" } )
            }

            const isFriend = await checkIsFriend(userId, targetId)
            if (!isFriend) {
                return Response.json({ data: [], isFriend: false })
            }

            const messages = await prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: userId, receiverId: targetId },
                        { senderId: targetId, receiverId: userId },
                    ],
                },
                orderBy: { createdAt: "asc" },
                include: {
                    sender: { select: { id: true, name: true } },
                    receiver: { select: { id: true, name: true } },
                },
            })

            // Mark received unread messages as read
            await prisma.message.updateMany({
                where: {
                    senderId: targetId,
                    receiverId: userId,
                    readAt: null,
                },
                data: { readAt: new Date() },
            })

            return Response.json({ data: messages })
        }

        return Response.json( { success: false, error: "Invalid type parameter" } )
    }
    catch (error) {
        return Response.json({ error: "Internal server error" }, { status: 500 })
    }
}


export async function POST(request)
{
    try {
        const session = await auth()
        const senderId = session?.user?.id

        if (!senderId) 
            return Response.json({ error: "Unauthorized" }, { status: 401 })

        const { receiverId, content } = await request.json()

        if (!receiverId || !content?.trim()) 
            return Response.json( { success: false, error: "Receiver ID and content are required" } )

        if (senderId === receiverId)
            return Response.json( { success: false, error: "Cannot message self" } )

        const isFriend = await checkIsFriend(receiverId, senderId)
        if (!isFriend) {
            return Response.json( { success: false, error: "Must be friends to send messages" } )
        }

        const newMsg = await prisma.message.create({
            data: {
                senderId,
                receiverId,
                content: content.trim(),
            },
            include: {
                sender: {
                    select: { id: true, name: true}
                }
            }
        })

        return Response.json(newMsg)
    }
    
    catch (error) {
        return Response.json({ error: "Internal server error" }, { status: 500 })
    }
}