async function apiFetch(url, options) {
	const res = await fetch(url, options)
	const data = await res.json()

	if (!res.ok) throw new Error(data.error || "Something went wrong")

	return data
}

export function signupSubmit(formData) {
	return apiFetch("/api/auth/signup", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(formData),
	})
}

export function newMatchSubmit(opponentName) {
	return apiFetch("/api/match", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ opponentName }),
	})
}

export function fetchMatchData(matchId) {
	return apiFetch(`/api/match/${matchId}`)
}

export function fetchRoll(matchId) {
	return apiFetch(`/api/match/${matchId}/roll`, { method: "POST" })
}

export function fetchRoundResolution(matchId) {
	return apiFetch(`/api/match/${matchId}/resolve`, { method: "POST" })
}

export function submitMatchAction(matchId, action, body) {
	return apiFetch(`/api/match/${matchId}/${action}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body || {}),
	})
}
