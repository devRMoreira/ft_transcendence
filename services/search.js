export async function cardSearchParams(filters = {})
{
	const params = new URLSearchParams()

	Object.keys(filters).forEach((key) => {
        const value = filters[key]
        if (Array.isArray(value)) {
            if (value.length > 0) {
                params.append(key, value.join(","))
            }
        } else if (value !== undefined && value !== null && value !== "") {
            params.append(key, value)
        }
    })

	const res = await fetch(`/api/search?${params.toString()}`, { method: "GET" })

	if (!res.ok)
	{
		console.error(`Search request failed with status: ${res.status}`)
        return []
	}

	const text = await res.text();
    if (!text) return []; // Prevents the unexpected end of data error

    const data = JSON.parse(text);
    return data.cards || []
}