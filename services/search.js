export async function getSearchParams()
{
	const params = new URLSearchParams({
		q, 
		rarity,
		sortBy,
		sortDir,
	})

	const res = await fetch("/api/search?", { method: "GET" })
	///api/search?${params.toString()}

	// if (!res)

	const data = await res.json()
}