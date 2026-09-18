export async function fetchUserMatchHistory() {
	const res = await fetch(`/api/match_history`)

	if (!res.ok) throw new Error("Something went wrong")

	return await res.json()
}

export async function getUserData()
{
    const res = await fetch(`/api/profile?`, { method: "GET" })

    const data = await res.json();
    return data.userData
}