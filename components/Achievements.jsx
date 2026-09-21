"use client"

import { Box, Chip, Paper, Stack, Typography } from '@mui/material'

// achievement icons
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import HikingOutlinedIcon from '@mui/icons-material/HikingOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';

import { getCompletedMatches, getWins, getCloseWins, getFlawlessWins, getMaxWinStreak, getAchievementTier} from "@/lib/achievements/stats"
import RankIcon from "@/components/RankIcon";
import { fetchLeaderboard } from "@/services/leaderboard";
import { useEffect, useState } from 'react';

export const ACHIEVEMENTS_LIST = [
    {
        id: "hall_of_fame",
        title: "Hall of Fame",
        prefix: "Reach rank",
        suffix: "on leaderboard",
        icon: <EmojiEventsOutlinedIcon />,
        getValue: ({ userRank }) => userRank,
        targets: [3, 2, 1],
        isUnlocked: (val, target) => val != null && val > 0 && val <= target,
    },
    {
        id: "journey",
        title: "The Journey",
        prefix: "Play",
        suffix: "matches",
        icon: <HikingOutlinedIcon />,
        getValue: ({ matches }) => getCompletedMatches(matches).length,
        targets: [1, 10, 30],
        isUnlocked: (val, target) => val >= target,
    },
    {
        id: "warrior",
        title: "Warrior",
        prefix: "Win",
        suffix: "matches",
        icon: <SportsMartialArtsIcon />,
        getValue: ({ matches, userId }) => getWins(matches, userId).length,
        targets: [3, 10, 20],
        isUnlocked: (val, target) => val >= target,
    },
    {
        id: "not_even_close",
        title: "Not even close!",
        prefix: "Win",
        suffix: "close matches by 1 pt",
        icon: <ThumbUpOffAltIcon />,
        getValue: ({ matches, userId }) => getCloseWins(matches, userId).length,
        targets: [1, 3, 5],
        isUnlocked: (val, target) => val >= target,
    },
    {
        id: "flawless",
        title: "Flawless Form",
        prefix: "Win",
        suffix: "matches conceding 0 pts",
        icon: <SelfImprovementIcon />,
        getValue: ({ matches, userId }) => getFlawlessWins(matches, userId).length,
        targets: [1, 3, 5],
        isUnlocked: (val, target) => val >= target,
    },
    {
        id: "on_fire",
        title: "On Fire",
        prefix: "Win",
        suffix: "matches in a row",
        icon: <LocalFireDepartmentOutlinedIcon />,
        getValue: ({ matches, userId }) => getMaxWinStreak(matches, userId),
        targets: [2, 3, 5],
        isUnlocked: (val, target) => val >= target,
    },
]

export default function Achievements({ userId, matches = [] })
{
    const [userRank, setUserRank] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadRank() {
            setLoading(true)

            const res = await fetchLeaderboard()
            if (!res.error && res.leaderboard) {
                const player = res.leaderboard.find((p) => p.id === userId)
                if (player)
                    setUserRank(player.rank)
            }
            setLoading(false)
        }

        loadRank()
    }, [userId])

    const contextData = { matches, userId, userRank }

    const foundAchievements = ACHIEVEMENTS_LIST.map((achievement) => {
        const value = achievement.getValue(contextData) ?? 0
        const tier = getAchievementTier(achievement, value)
        return { ...achievement, tier }
    }).filter((achievement) => achievement.tier > 0)

    return (
        <Box sx={{ width: "100%" }}>
            <Typography sx={{color: 'text.secondary'}}>
                Achievements
            </Typography>

            {foundAchievements.length === 0 ? (
                <Typography color="text.secondary">
                    No achievements discovered yet. Keep playing!
                </Typography>
            ) : (
                <Stack spacing={1}>
                    {foundAchievements.map((achievement) => {
                        const activeIndex = achievement.tier - 1
                        const rank = 4 - achievement.tier
                        const value = achievement.getValue(contextData)

                        const targetsText = achievement.targets.map((target, idx) => (
                            <Box key={idx} component="span" sx={{
                                fontWeight: idx === activeIndex ? "bold" : "normal",
                                color: idx === activeIndex ? "text.primary" : "text.secondary",
                            }} >
                                {idx > 0 && " / "}
                                {achievement.id === "hall_of_fame" ? `#${target}` : target}
                            </Box>
                        ))

                        return (
                            <Paper key={achievement.id} elevation={2} sx={{ py: 1.2, px: 2 }}>
                                <Stack direction="row" spacing={2} sx={{ alignItems: "center", justifyContent: "space-between" }}>
                                    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                                        <RankIcon rank={rank} icon={achievement.icon} />
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: "bold", lineHeight: 1.2 }}>
                                                {achievement.title}
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary">
                                                {achievement.prefix} {targetsText} {achievement.suffix}
                                            </Typography>

                                        </Box>
                                    </Stack>

                                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "primary.main" }}>
                                        {achievement.id === "hall_of_fame" ? "" : value + " matches"} 
                                    </Typography>
                                </Stack>
                            </Paper>
                        )
                    })}
                </Stack>
            )}
        </Box>
    )
}