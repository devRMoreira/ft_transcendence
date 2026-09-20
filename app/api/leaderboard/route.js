import { prisma } from "@/lib/prisma"

const MIN_MATCHES_REQUIRED = 1 // Minimum matches to qualify for the ranked board
const WIN_POINTS = 10
const LOSS_POINTS = -3

export async function GET() {
    try {
        const matches = await prisma.match.findMany({
            where: {
                status: "COMPLETE",
            },
            select: {
                id: true,
                winnerId: true,
                player1: { select: { id: true, name: true } },
                player2: { select: { id: true, name: true } },
            }
        })

        const statsMap = new Map()

        const getOrCreatePlayer = (player) => {
            if (!statsMap.has(player.id)) {
                statsMap.set(player.id, {
                    id: player.id,
                    name: player.name,
                    wins: 0,
                    losses: 0,
                    totalMatches: 0,
                    points: 0,
                    winRate: 0,
                })
            }
            return statsMap.get(player.id)
        }

        for (const match of matches) {
            if (!match.player1 || !match.player2) continue

            const p1 = getOrCreatePlayer(match.player1)
            const p2 = getOrCreatePlayer(match.player2)

            p1.totalMatches += 1
            p2.totalMatches += 1

            if (match.winnerId === p1.id) {
                p1.wins += 1
                p1.points += WIN_POINTS
                p2.losses += 1
                p2.points += LOSS_POINTS
            } else if (match.winnerId === p2.id) {
                p2.wins += 1
                p2.points += WIN_POINTS
                p1.losses += 1
                p1.points += LOSS_POINTS
            }
        }

        const leaderboard = Array.from(statsMap.values())
            .map((player) => {
                const winRate = player.totalMatches > 0 
                    ? Number(((player.wins / player.totalMatches) * 100).toFixed(1))
                    : 0
                return {
                    ...player,
                    netWins: player.wins - player.losses,
                    winRate,
                }
            })
            .filter((player) => player.totalMatches >= MIN_MATCHES_REQUIRED)
            .sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points
                if (b.winRate !== a.winRate) return b.winRate - a.winRate
                if (b.netWins !== a.netWins) return b.netWins - a.netWins
                return b.totalMatches - a.totalMatches
            })
            .map((player, index) => ({
                rank: index + 1,
                ...player,
            }))

        return Response.json({ leaderboard })
    }
    catch (error)
    {
        console.error("Leaderboard route error:", error)
        return Response.json({ leaderboard: [], error: "Internal Server Error" }, { status: 500 })
    }
}