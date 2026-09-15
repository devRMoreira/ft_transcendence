export async function fetchFriendData(reqType) 
{
    const res = await fetch(`/api/friends?type=${reqType}`, { method: "GET" })
    
    if (!res.ok) {
        if (res.status === 401) return [];

        console.error(`friend data query failed with status: ${res.status}`);
        return [];
    }
    
    const json = await res.json()
    return json.data || []
}

export async function getFriends() // fetch accepted friends to display in list
{
    return fetchFriendData("accepted");
}

export async function getPendingReqSent() // fetch requests to display in SENT
{
    return fetchFriendData("sent");
}

export async function getPendingReqReceived() // fetch requests to display in RECEIVED
{
    return fetchFriendData("received");
}

export async function getFriendStatus(userId2) 
{
    if (!userId2)
        return [];

    const res = await fetch(`/api/friends?type=status&targetId=${userId2}`, { method: "GET" })
    if (!res.ok)
	{
		console.error(`friend status query failed with status: ${res.status}`)
        return []
	}
    const json = await res.json()
    return json.data || []
}

export async function sendFriendReq(recipient) 
{
    const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient }),
    })

    const json = await res.json()

    if (!res.ok)
	{
		console.error(`Send friend req failed: ${json.error || res.status}`)
        return { error: json.error || "Failed to send request" }
	}

    return json
}

export async function acceptFriendReq(addresseeId) 
{
    const res = await fetch("/api/friends", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresseeId }),
    })

    if (!res.ok)
	{
		console.error(`accept friend req failed with status: ${res.status}`)
        return []
	}

    return await res.json()
}

export async function cancelFriendReq(requestId) {
    const res = await fetch("/api/friends", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action: "cancel" }),
    })

    const json = await res.json().catch(() => ({}))

    if (!res.ok) {
        console.error(`Cancel friend req failed with status: ${res.status}`)
        return { error: json.error || "Failed to cancel request" }
    }

    return json
}

export async function declineFriendReq(requestId) {
    const res = await fetch("/api/friends", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action: "decline" }),
    })

    const json = await res.json().catch(() => ({}))

    if (!res.ok) {
        console.error(`Decline friend req failed with status: ${res.status}`)
        return { error: json.error || "Failed to decline request" }
    }

    return json
}