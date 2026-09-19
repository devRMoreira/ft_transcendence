export async function fetchUserMatchHistory(targetUserId) {
    const url = targetUserId ? `/api/match_history?targetUserId=${targetUserId}` : `/api/match_history`
	
    try {
        const res = await fetch(url , { method: "GET" })

        if (!res.ok)
            return { userId: null, matches: [] }

        const data = await res.json()
        return {
            userId: data.userId || null,
            matches: Array.isArray(data.matches) ? data.matches : []
        }
    }
    catch {
        return { targetUserId: null, matches: [] }
    }
}

export async function getUserData(targetUserId)
{
    const url = targetUserId ? `/api/profile?targetUserId=${targetUserId}` : `/api/profile`
    const res = await fetch(url , { method: "GET" })

    const data = await res.json();
    return data.userData
}