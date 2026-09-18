"use client"

import { Container, Box, Stack, Typography, Paper, Divider, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { getUserData, fetchUserMatchHistory } from "@/services/profile";
import { GameRoundHistory } from "@/components/GameRoundHistory"
import { fetchMatchData } from "@/services/api"
import { useEffect, useState } from "react";
import { ExpandMore } from '@mui/icons-material'
import { useSearchParams } from "next/navigation";

export default function ProfilePage()
{
    const searchParams = useSearchParams()
    const targetUserId = searchParams.get("targetUserId")

    const [userData, setUserData] = useState();
    const [matchHistory, setMatchHistory] = useState();
    const [loading, setLoading] = useState(true);
    const [expandedMatch, setExpandedMatch] = useState(false); 

    useEffect(() => {
        async function loadUserProfile()
        {
            try {
                const userProfileData = await getUserData(targetUserId)
                setUserData(userProfileData)
            }
            catch (error) { console.error("Failed to load user profile:", error) }

            try {
                const matchHistoryData = await fetchUserMatchHistory(targetUserId)
                setMatchHistory(matchHistoryData)
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
                                matchHistory.map((match) =>  
                                    <Accordion key={match.id} /* expanded={expanded === 'add'} */ disableGutters elevation={2}>
                                        <AccordionSummary>Match VS USER (X : Y score)</AccordionSummary> 
                                        <AccordionDetails sx={{ p: 0, /* backgroundColor: 'background.lighter' */ }}>
                                            <GameRoundHistory /* log={log} you={you} */ />
                                        </AccordionDetails>
                                    </Accordion>
                                )
                            )}

                        </Stack>
                    </Stack>
                </Paper>
            </Box>
        </Container>
    );

}


