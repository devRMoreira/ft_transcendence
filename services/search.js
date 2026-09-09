export async function cardSearchParams(filters = {})
{
	const params = new URLSearchParams(filters)

	const res = await fetch("/api/search?${params.toString()}", { method: "GET" })

	// if (!res)

	const data = await res.json()
    return data.cards
}