"use client"

import { Container, Box, Stack, Typography, Paper, Divider, Button, IconButton, Popover, Accordion, AccordionSummary, AccordionDetails, Collapse, TextField } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ChatIcon from '@mui/icons-material/Chat';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import StyleIcon from '@mui/icons-material/Style';
import CheckIcon from '@mui/icons-material/Check';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import SendIcon from '@mui/icons-material/Send';
import { getFriends, getPendingReqSent, getPendingReqReceived, getFriendStatus, sendFriendReq, acceptFriendReq, cancelFriendReq, declineFriendReq } from "../../services/friends";
import { useCallback, useEffect, useState } from "react";

export default function friendsPage()
{
    //for accordion tabs
    const [expanded, setExpanded] = useState(false); 
    const [friends, setFriends] =  useState([])
    const [sentReqs, setSentReqs] =  useState([])
    const [receivedReqs, setReceivedReqs] =  useState([])
    const [addFriendInput, setAddFriendInput] = useState("")
    const [loading, setLoading] = useState(false)

    // REDIRECT TO SIGNIN / SIGNUP if not logged in
    //

    const handleAccordionToggle = (panel) => {
        setExpanded((prev) => (prev === panel ? false : panel))
    }

    const loadData = useCallback(async () => {
        try {
            const [friendsData, sentReqsData, receivedReqsData] = await Promise.all([
                getFriends(),
                getPendingReqSent(),
                getPendingReqReceived(),
            ])

            setFriends(Array.isArray(friendsData) ? friendsData : [])
            setSentReqs(Array.isArray(sentReqsData) ? sentReqsData : [])
            setReceivedReqs(Array.isArray(receivedReqsData) ? receivedReqsData : [])
        }
        catch (error) {
            console.error("Failed to load friends data:", error);
        }
    }, [])

    useEffect(() => {
        loadData()
    }, [loadData])

    const handleAddFriend = async (e) => {
        e.preventDefault();
        
        const recipient = addFriendInput.trim();
        if (!recipient) return;

        setLoading(true);
        try {
            const res = await sendFriendReq(recipient);
            
            if (res?.error) {
                alert(res.error);
            } else {
                setAddFriendInput(""); // Clear field on success
                await loadData();      // Refresh list to show new pending request
            }
        } catch (err) {
            console.error("Error sending request:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async (requestId) => {
        setLoading(true);
        try {
            const res = await acceptFriendReq(requestId);
            if (res?.error) {
                alert(res.error);
            } else {
                await loadData();
            }
        } catch (err) {
            console.error("Error accepting friend request:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSentRequest = async (requestId) => {
        setLoading(true);
        try {
            const res = await cancelFriendReq(requestId);
            if (res?.error) {
                alert(res.error);
            } else {
                await loadData(); 
            }
        } catch (err) {
            console.error("Error canceling request:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeclineRequest = async (requestId) => {
        setLoading(true);
        try {
            const res = await declineFriendReq(requestId);
            if (res?.error) {
                alert(res.error);
            } else {
                await loadData();
            }
        } catch (err) {
            console.error("Error declining request:", err);
        } finally {
            setLoading(false);
        }
    };

    return(
        <Container maxWidth="sm">
            <Box sx={{
                minHeight: "100dvh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Paper sx={{ width: "100%" }}>
                    <Stack>

                        <Typography component="h1" variant="h5" sx={{ mt: 1, p:1.5 , px:5}}>
                            Friends
                        </Typography>

                        <Paper square sx={{
                            px: 0,
                            backgroundColor: 'background.lighter',
                            display: "flex",
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <Button
                                /* onClick={} */ 
                                onClick={() => handleAccordionToggle('add')}
                                variant="text"
                                startIcon={<PersonAddIcon color=""/>} 
                                sx={{ flex: 1.2, fontSize: "0.8em", color: expanded == 'add' ? 'primary' : 'white'}}
                                >
                                    Add friend
                            </Button>
                            <Button
                                onClick={() => handleAccordionToggle('sent')}
                                variant="text"
                                startIcon={<ArrowUpwardIcon color=""/>}
                                sx={{ flex: 1, fontSize: "0.8em", color: expanded == 'sent' ? 'primary' : 'white'}}
                                >
                                    Sent ({sentReqs.length})
                            </Button>
                            <Button 
                                onClick={() => handleAccordionToggle('received')}
                                variant="text"
                                startIcon={<ArrowDownwardIcon color=""/>}
                                sx={{ flex: 1.2, fontSize: "0.8em", color: expanded == 'received' ? 'primary' : 'white'}}
                                >
                                    Received ({receivedReqs.length})
                            </Button>
                        </Paper>

                        <Accordion
                            expanded={expanded === 'add'} 
                            disableGutters
                            elevation={2}
                        >
                            {/* Required for proper expansion/retraction */}
                            <AccordionSummary sx={{ display: 'none' }} /> 
                            <AccordionDetails sx={{ p: 0, backgroundColor: 'background.lighter' }}>
                                <Stack onSubmit={handleAddFriend} component="form" direction="row" sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    py: 1.4,
                                    px: 5,
                                }}>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter email or username..."
                                        variant="outlined"
                                        value={addFriendInput}
                                        onChange={(e) => setAddFriendInput(e.target.value)}
                                        disabled={loading}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<SendIcon />}
                                        disabled={loading || !addFriendInput.trim()}
                                        sx={{ whiteSpace: 'nowrap' }}
                                    ></Button>                                    
                                </Stack>
                            </AccordionDetails>
                        </Accordion>

                        {/* SENT REQUESTS */}
                        <Accordion expanded={expanded === 'sent'} disableGutters elevation={2}>
                            <AccordionSummary sx={{ display: 'none' }} /> 
                            <AccordionDetails sx={{ p: 0, backgroundColor: 'background.lighter' }}>
                                {sentReqs.length == 0 ? (
                                    <Typography align="center" sx={{py: 2}}>
                                        You have no sent requests
                                    </Typography>
                                ) : (
                                    <Stack divider={<Divider flexItem variant="fullWidth" sx={{ borderBottomWidth: 2 }}/>}>
                                        {sentReqs.map((sentReq) => (
                                            <Box key={sentReq.id} sx={{ py: 1, px: 5 }}>
                                                <Stack direction="row" spacing={1.5} sx={{alignItems: "center"}}>
                                                    <Typography>
                                                        {sentReq.addressee.name} 
                                                    </Typography>

                                                    <IconButton aria-label="cancel request" disabled={loading} color="error"
                                                        onClick={() => handleCancelSentRequest(sentReq.id)}>
                                                        <CancelOutlinedIcon />
                                                    </IconButton>
                                                </Stack>
                                            </Box>
                                        ))}
                                   </Stack>
                                )}
                            </AccordionDetails>
                        </Accordion>

                        {/* RECEIVED REQUESTS */}
                        <Accordion expanded={expanded === 'received'} disableGutters elevation={2}>
                            <AccordionSummary sx={{ display: 'none' }} /> 
                            <AccordionDetails sx={{ p: 0, backgroundColor: 'background.lighter' }}>
                                {receivedReqs.length === 0 ? (
                                    <Typography align="center" sx={{ py: 2 }}>
                                        You have no incoming requests
                                    </Typography>
                                ) : (
                                    <Stack divider={<Divider flexItem variant="fullWidth" sx={{ borderBottomWidth: 2 }}/>}>
                                        {receivedReqs.map((receivedReq) => (
                                            <Box key={receivedReq.id} sx={{ py: 1, px: 5 }}>
                                                <Stack direction="row" spacing={1.5} sx={{alignItems: "center"}}>
                                                    <Typography>
                                                        {receivedReq.requester.name} 
                                                    </Typography>

                                                    <Stack direction="row" spacing={0.5} sx={{flex: 1}}>
                                                        <IconButton aria-label="accept request" disabled={loading} color="success"
                                                            onClick={() => handleAcceptRequest(receivedReq.id)}>
                                                            <CheckIcon/>
                                                        </IconButton>

                                                        <IconButton aria-label="decline request" disabled={loading} color="error"
                                                            onClick={() => handleDeclineRequest(receivedReq.id)}>
                                                            <CancelOutlinedIcon/>
                                                        </IconButton>
                                                    </Stack>
                                                </Stack>
                                            </Box>
                                        ))}
                                    </Stack>
                                )}
                            </AccordionDetails>
                        </Accordion>
                        
                        <Stack divider={<Divider flexItem variant="fullWidth" sx={{ borderBottomWidth: 2 }}/>}>
                            {friends.length == 0 ? (
                                <Typography align="center" sx={{py: 3, color: "theme.secondary"}}>
                                    You currently have no friends
                                </Typography>
                            ) : (
                                friends.map((friend) => (
                                <Box key={friend.id}> {/* exists only to contain the enclosed elements in a single UI elem */}
                                    <Stack direction="row" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, py: 0.3, px: 5, }}>
                                        <Typography sx={{flex: 5}}>
                                            {friend.name}
                                        </Typography>

                                        <Stack direction="row" spacing={1} sx={{flex: 1}}>

                                            <IconButton aria-label="open chat" /* onClick={} */>
                                                <ChatIcon/>
                                            </IconButton>

                                            <IconButton aria-label="open profile" /* onClick={} */>
                                                <AccountBoxIcon/>
                                            </IconButton>

                                            <IconButton aria-label="invite to game" /* onClick={} */>
                                                <StyleIcon/>
                                            </IconButton>
                                        </Stack>
                                    </Stack>
                                </Box>
                                ))
                            )}
                        </Stack>
                    </Stack>
                </Paper>
            </Box>
        </Container>
    );

}    

// direction="row" alignitems="center" justifycontent="space-between" 

    // Friends System
    // Backend - endpoints to send, accept, decline, and list friend requests. Friendship model (PENDING/ACCEPTED/DECLINED) already exists in the schema.
    // Frontend - friends list view, send-request UI (by email or name), accept/decline UI for incoming requests.