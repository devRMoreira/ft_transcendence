export function rollStat() {
	const stats = ["atk", "def", "spd", "wis"]

	return stats[Math.floor(Math.random() * stats.length)]
}

export function rollD6()
{
	return Math.floor(Math.random() * 6) + 1
}