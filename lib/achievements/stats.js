export const getCompletedMatches = (matches = []) =>
    matches.filter((m) => m.status === "COMPLETE")

export const getWins = (matches = [], userId) =>
    getCompletedMatches(matches).filter((m) => m.winnerId === userId)

export const getCloseWins = (matches = [], userId) =>
    getWins(matches, userId).filter((m) => {
        const scores = m.state?.scores;
        return scores && Math.abs(scores.player1 - scores.player2) === 1
    }
)

export const getFlawlessWins = (matches = [], userId) =>
    getWins(matches, userId).filter((m) => {
        const isP1 = m.player1?.id === userId
        const opponentScore = isP1 ? m.state?.scores?.player2 : m.state?.scores?.player1
        return opponentScore === 0
    }
)

export const getMaxWinStreak = (matches = [], userId) => {
    let current = 0
    let max = 0

    const sorted = [...getCompletedMatches(matches)].reverse()
    for (const m of sorted) {
        if (m.winnerId === userId) {
            current++
            if (current > max) max = current
        } else {
            current = 0
        }
    }
    return max
}

export function getAchievementTier(achievement, value) {
  if (value == null)
    return 0

  const tiersUnlocked = achievement.targets.filter((target) => achievement.isUnlocked(value, target)).length

  return tiersUnlocked
}