export async function getCards()
{
	const res = await fetch("/api/search", { method: "GET" })
	///api/search?${params.toString()}

	if (!res.ok)
    {
        //err
    }

	const data = await res.json()
    return data.cards
}
