"use client"

import { Container, Box, Button, Dialog, DialogTitle, Stack, Typography, Paper, Divider, Accordion, AccordionSummary, AccordionDetails, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { getUserData, fetchUserMatchHistory } from "@/services/profile";
import { removeFriend } from "@/services/friends";
import { GameRoundHistory } from "@/components/GameRoundHistory"
import { useEffect, useState } from "react";
import { ExpandMore } from '@mui/icons-material'
import { useSearchParams } from "next/navigation";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import Achievements from "../../components/Achievements";



export default function ProfilePage()
{
    const searchParams = useSearchParams()
    const targetUserId = searchParams.get("targetUserId")

    const [userProfileId, setUserProfileId] = useState()
    const [userData, setUserData] = useState()
    const [matchHistory, setMatchHistory] = useState()
    const [loading, setLoading] = useState(true)
    
    const [friendshipStatus, setFriendshipStatus] = useState("NONE")
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)
    
    const [expandedMatchId, setExpandedMatchId] = useState(false)

    const handleAccordionChange = (matchId) => (event, isExpanded) => {
        setExpandedMatchId(isExpanded ? matchId : false);
    };

    useEffect(() => {
        async function loadUserProfile()
        {
            setLoading(true)
            setFriendshipStatus("NONE")     
            setUserData(null)
            setMatchHistory(null)

            try {
                const userProfileData = await getUserData(targetUserId)
                setUserData(userProfileData)
            }
            catch (error) {
                console.error("Failed to load user profile:", error)
            }

            try {
                const { userId, matches } = await fetchUserMatchHistory(targetUserId)
                setMatchHistory(matches)
                setUserProfileId(userId)
            }
            catch (error) { 
                console.error("Failed to load user profile:", error) 
                setMatchHistory([])
            }

            if (targetUserId) {
                try {
                    const res = await fetch(`/api/friends?type=status&targetId=${targetUserId}`);
                    const json = await res.json();
                    if (json?.data?.status) {
                        setFriendshipStatus(json.data.status);
                    }
                } catch (error) {
                    console.error("Failed to fetch friendship status:", error);
                }
            }

            setLoading(false);
        }

        loadUserProfile()
    }, [targetUserId])

    const handleRemoveFriend = async () => {
        setActionLoading(true)
        
        const res = await removeFriend(targetUserId)

        if (res.error) {
            console.error("Failed to remove friend:", res.error)
        } else {
            setFriendshipStatus("NONE")
            setOpenConfirmDialog(false)
        }

        setActionLoading(false);
    }

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
        )

    const joinDateOnly = userData?.createdAt ? new Date(userData.createdAt).toISOString().split("T")[0] : "Unknown";

    return(
        <Container maxWidth="md">
            <Box sx={{
                mt: 3,
                minHeight: "75dvh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Paper sx={{ width: "100%" }} >
                    <Paper elevation={3} sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        px: 4, 
                        pt: 3, 
                        pb: 2,
                        backgroundColor: 'background.lighter',
                        borderBottomLeftRadius: 0, 
                        borderBottomRightRadius: 0,
                    }}>
                        <Typography component="h1" variant="h4" sx={{fontWeight: "bold", }}>
                            {userData?.name}
                        </Typography>

                        {/* Show button only if friendship is ACCEPTED */}
                        {targetUserId && friendshipStatus === "ACCEPTED" && (
                            <Button 
                                variant="outlined" 
                                color="error" 
                                startIcon={<PersonRemoveIcon />}
                                onClick={() => setOpenConfirmDialog(true)}
                            >
                                Remove Friend
                            </Button>
                        )}
                    </Paper>

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

                        {!targetUserId && ( 
                        <Stack>
                            <Typography sx={{color: 'text.secondary'}}>
                                Email
                            </Typography>
                            <Typography>
                                {userData.email}
                            </Typography>
                        </Stack>
                        )}

                        <Achievements userId={userProfileId} matches={matchHistory}></Achievements>

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
                                            sx={{ backgroundColor: expandedMatchId == match.id ? 'background.lighter' : "background.primary", }}
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

                <Dialog 
                    open={openConfirmDialog} 
                    onClose={() => setOpenConfirmDialog(false)}
                >
                    <DialogTitle>Remove Friend</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to remove <strong>{userData?.name}</strong> from your friends list?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ pb: 2, px: 3 }}>
                        <Button 
                            onClick={() => setOpenConfirmDialog(false)} 
                            disabled={actionLoading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleRemoveFriend} 
                            color="error" 
                            variant="contained" 
                            disabled={actionLoading}
                        >
                            {actionLoading ? "Removing..." : "Remove"}
                        </Button>
                    </DialogActions>
                </Dialog>

            </Box>
        </Container>
    );

}


