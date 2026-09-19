"use client"

import { Container, Box, Stack, Typography, Paper, Divider, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { getUserData, fetchUserMatchHistory } from "@/services/profile";
import { GameRoundHistory } from "@/components/GameRoundHistory"
import { useEffect, useState } from "react";
import { ExpandMore } from '@mui/icons-material'
import { useSearchParams } from "next/navigation";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

export default function ProfilePage()
{
    const searchParams = useSearchParams()
    const targetUserId = searchParams.get("targetUserId")

    const [userProfileId, setUserProfileId] = useState()
    const [userData, setUserData] = useState()
    const [matchHistory, setMatchHistory] = useState()
    const [loading, setLoading] = useState(true)
    
    const [expandedMatchId, setExpandedMatchId] = useState(false)

    const handleAccordionChange = (matchId) => (event, isExpanded) => {
        setExpandedMatchId(isExpanded ? matchId : false);
    };


    useEffect(() => {
        async function loadUserProfile()
        {
            try {
                const userProfileData = await getUserData(targetUserId)
                setUserData(userProfileData)
            }
            catch (error) { console.error("Failed to load user profile:", error) }

            try {
                const { userId, matches } = await fetchUserMatchHistory(targetUserId)
                setMatchHistory(matches)
                setUserProfileId(userId)
            }
            catch (error) { 
                console.error("Failed to load user profile:", error) 
                setMatchHistory([])
            }

            setLoading(false);
        }

        loadUserProfile()
    }, [targetUserId])

    if (loading) 
        return (
            <Container maxWidth="md">
                <Box sx={{
                    minHeight: "100dvh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}></Box>
            </Container>
        );

    const joinDateOnly = userData?.createdAt ? new Date(userData.createdAt).toISOString().split("T")[0] : "Unknown";

    return(
        <Container maxWidth="md">
            <Box sx={{
                minHeight: "100dvh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Paper sx={{ width: "100%" }}>
                    <Typography component="h1" variant="h4" sx={{ px:4 , py: 2, mt: 1}}>
                        {userData.name}
                    </Typography>

                    <Divider variant="fullWidth" sx={{ borderBottomWidth: 2 }}></Divider>
                    <Stack spacing={3} sx={{ px:4 , py: 2, }}>
                        <Stack>
                            <Typography sx={{color: 'text.secondary'}}>
                                Joined on
                            </Typography>
                            <Typography>
                                {joinDateOnly}
                            </Typography>
                        </Stack>

                        <Stack>
                            <Typography sx={{color: 'text.secondary'}}>
                                Email
                            </Typography>
                            <Typography>
                                {userData.email}
                            </Typography>
                        </Stack>

                        <Stack>
                            <Typography sx={{color: 'text.secondary'}}>
                                Match History
                            </Typography>

                            {!matchHistory || matchHistory.length === 0 ? (
                                 <Typography sx={{color: 'text.secondary'}}>
                                    No matches played yet
                                </Typography>
                            ) : (
                                matchHistory.map((match) => {
                                    const { winner, scores, log } = match.state || {}
	                                
                                    const userId = userProfileId
                                    const isMatchComplete = match.status === "COMPLETE"
                                    const userWon = match.winnerId === userId
                                    const isPlayer1 = match.player1?.id === userId
                                    const you = isPlayer1 ? "player1" : "player2"
                                    
                                    const opponent = isPlayer1 ? match.player2 : match.player1;
                                    const opponentName = match.isVsAI ? "AI" : (opponent?.name || "Unknown");

                                    const finalScore = isMatchComplete
                                        ? (isPlayer1 ? `${scores.player1} : ${scores.player2}` : `${scores.player2} : ${scores.player1}`)
                                        : "- : -";

                                    return(
                                        <Accordion key={match.id} disableGutters elevation={2}
                                            expanded={expandedMatchId === match.id}
                                            onChange={handleAccordionChange(match.id)}
                                            disabled={!isMatchComplete}
                                        >
                                            <AccordionSummary expandIcon={isMatchComplete ? <ExpandMore /> : null}>
                                                    <Typography color={!isMatchComplete ? "warning" : userWon ? "success" : "error"}>
                                                        {!isMatchComplete ? "Abandoned" : userWon ? "Victory" : "Defeat"} ({finalScore}) VS {opponentName} </Typography>
                                                    <Typography> </Typography>
                                            </AccordionSummary> 
                                            <AccordionDetails sx={{ pb: 3, /* backgroundColor: 'background.lighter' */ }}>
                                                {<GameRoundHistory log={log} you={you}/>}
                                            </AccordionDetails>
                                        </Accordion>
                                    )
                                })
                            )}

                        </Stack>
                    </Stack>
                </Paper>
            </Box>
        </Container>
    );

}


