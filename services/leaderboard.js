export async function fetchLeaderboard() {
    try {
        const res = await fetch("/api/leaderboard")
        const data = await res.json().catch(() => ({}))

        if (!res.ok)
            return { leaderboard: [] }

        return {
            leaderboard: Array.isArray(data.leaderboard) ? data.leaderboard : []
        }
    }
    catch (error) {
        return { leaderboard: [], error: "Network error" }
        
    }
}