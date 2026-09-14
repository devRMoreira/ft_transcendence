export async function fetchFriendData(userId, reqType) 
{
    if (!userId)
        return [];

    const res = await fetch(`/api/friends?userId=${userId}&type=${reqType}`, { method: "GET" })
    if (!res.ok)
	{
		console.error(`friend data query failed with status: ${res.status}`)
        return []
	}
    const json = await res.json()
    return json.data || []
}

export async function getFriends(userId) // fetch accepted friends to display in list
{
    return fetchFriendData(userId, "accepted");
}

export async function getPendingReqSent(userId) // fetch requests to display in SENT
{
    return fetchFriendData(userId, "sent");
}

export async function getPendingReqReceived(userId) // fetch requests to display in RECEIVED
{
    return fetchFriendData(userId, "received");
}

export async function getFriendStatus(userId1, userId2) 
{
    if (!userId1 || !userId2)
        return [];

    const res = await fetch(`/api/friends?userId=${userId1}&type=status&targetId=${userId2}`, { method: "GET" })
    if (!res.ok)
	{
		console.error(`friend status query failed with status: ${res.status}`)
        return []
	}
    const json = await res.json()
    return json.data || []
}

export async function sendFriendReq(senderId, receiverId) 
{
    const res = await fetch("/api/friends", {
        method: POST,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId, receiverId }),
    })

    if (!res.ok)
	{
		console.error(`send friend req failed with status: ${res.status}`)
        return []
	}

    const ret = await res.json()
    return ret
}

export async function acceptFriendReq(userId1, userId2) 
{
    const res = await fetch("/api/friends", {
        method: PATCH,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId, receiverId }),
    })

    if (!res.ok)
	{
		console.error(`accept friend req failed with status: ${res.status}`)
        return []
	}

    const ret = await res.json()
    return ret
}
