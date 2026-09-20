export async function getConversationList()
{
    const res = await fetch(`/api/messages?type=conversations`, { method: "GET" })

    if (!res.ok) {
        console.error(`Fetch conversations failed: ${res.status}`)
        return []
    }

    const json = await res.json()
    return json.data || []
}

export async function getMessageHistory(targetId)
{
    if (!targetId)
        return []

    const res = await fetch(`/api/messages?type=history&targetId=${targetId}`, { method: "GET" })
    if (!res.ok) {
        console.error(`Fetch message history failed: ${res.status}`)
        return []
    }
    const json = await res.json()
    return json.data || []
}

export async function sendMessage(receiverId, content) {
    const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId, content }),
    })

    if (!res.ok) {
        console.error(`Send message failed: ${res.status}`)
        throw new Error(`Failed to send message (${res.status})`);
    }

    const text = await res.text()
    return text ? JSON.parse(text) : null
}