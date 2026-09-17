import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

// get list of messages with various users, with most recent last messages in each being the sorting order

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
            return Response.json({ error: "Missing fetch type" }, { status: 400 })

        if (type === "conversations")
        {
            const latestMessageList = await prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: userId },
                        { receiverId: userId},
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
                return Response.json({ error: "Missing targetId parameter" }, { status: 400 })
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

        return Response.json({ error: "Invalid type parameter" }, { status: 400 })
    }
    catch (error) {
        console.error("API /messages error:", error)
        return Response.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(request) // SEND FRIEND REQUEST
{
    try {
        const session = await auth()
        const senderId = session?.user?.id

        if (!senderId) 
            return Response.json({ error: "Unauthorized" }, { status: 401 })

        const { receiverId, content } = await request.json()

        if (!receiverId || !content?.trim()) 
            return Response.json( { error: "Receiver ID and content are required." }, { status: 400 } )

        if (senderId === receiverId)
            return Response.json( { error: "Cannot message self." }, { status: 400 } )

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
        console.error("API /messages error:", error)
        return Response.json({ error: "Internal server error" }, { status: 500 })
    }
}