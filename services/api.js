async function apiFetch(url, options)
{
	const res = await fetch(url, options)
	const data = await res.json()

	if(!res.ok)
		throw new Error(data.error || "Something went wrong")

	return data
}

export async function signupSubmit(formData)
{
	return await apiFetch("/api/auth/signup", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(formData)
	})
}

export async function newMatchSubmit(opponentName)
{
	return await apiFetch("/api/match", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ opponentName }),
		})
}