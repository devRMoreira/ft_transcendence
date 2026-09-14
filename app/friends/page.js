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
import { getFriends, getPendingReqSent, getPendingReqReceived, getFriendStatus, sendFriendReq, acceptFriendReq } from "../../services/friends";
import { useEffect, useState } from "react";

export default function friendsPage()
{
    // SAMPLE USER, TO REPLACE WITH SESSION.ID (dev2 ID)
    const currentUserId = "cmth8mwi200019ow6ajutd2q7";

    //for accordion tabs
    const [expanded, setExpanded] = useState(false);

    const [friends, setFriends] =  useState([])
    const [sentReqs, setSentReqs] =  useState([])
    const [receivedReqs, setReceivedReqs] =  useState([])

    const [addFriendInput, setAddFriendInput] = useState("")

    const handleAccordionToggle = (panel) => {
        setExpanded((prev) => (prev === panel ? false : panel))
    }

    useEffect(() => {
        if (!currentUserId) return

        const loadData = async () => {
            try {
                const [friendsData, sentReqsData, receivedReqsData] = await Promise.all([
                    getFriends(currentUserId),
                    getPendingReqSent(currentUserId),
                    getPendingReqReceived(currentUserId),
                ])

                setFriends(Array.isArray(friendsData) ? friendsData : [])
                setSentReqs(Array.isArray(sentReqsData) ? sentReqsData : [])
                setReceivedReqs(Array.isArray(receivedReqsData) ? receivedReqsData : [])
            }
            catch (error) {
                console.error("Failed to load friends data:", error);
            }
        }

        loadData()
    }, [currentUserId])



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
                                color={expanded === 'add' ? 'primary' : 'white'}
                                startIcon={<PersonAddIcon color=""/>} 
                                sx={{ flex: 1.2, fontSize: "0.8em",}}
                                >
                                    Add friend
                            </Button>
                            <Button
                                onClick={() => handleAccordionToggle('sent')}
                                variant="text"
                                color={expanded === 'sent' ? 'primary' : 'white'}
                                startIcon={<ArrowUpwardIcon color=""/>}
                                sx={{ flex: 1, fontSize: "0.8em",}}
                                >
                                    Sent
                            </Button>
                            <Button 
                                onClick={() => handleAccordionToggle('received')}
                                variant="text"
                                color={expanded === 'received' ? 'primary' : 'white'}
                                startIcon={<ArrowDownwardIcon color=""/>}
                                sx={{ flex: 1.2, fontSize: "0.8em",}}
                                >
                                    Received
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
                                <Stack component="form" direction="row" sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    py: 1.4,
                                    px: 5,
                                    /*onSubmit={(e) => {
                                    e.preventDefault(),
                                    // handle sendFriendReq logic here
                                    }} */
                                }}>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter email or username..."
                                        variant="outlined"
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<SendIcon />}
                                        sx={{ whiteSpace: 'nowrap' }}
                                    ></Button>                                    
                                </Stack>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion
                            expanded={expanded === 'sent'} 
                            disableGutters
                            elevation={2}
                        >
                            {/* Required for proper expansion/retraction */}
                            <AccordionSummary sx={{ display: 'none' }} /> 
                            <AccordionDetails sx={{ p: 0, backgroundColor: 'background.lighter' }}>
                                <Stack direction="row" sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    py: 0.3,
                                    px: 5,
                                }}>
                                    {sentReqs.length == 0 ? (
                                        <Typography align="center" sx={{py: 2}}>
                                            You have no sent requests
                                        </Typography>
                                    ) : (
                                        sentReqs.map((sentReq) => (
                                            <Box key={sentReq.id}>
                                                <Typography sx={{py: 0.7, flex: 5}}>
                                                    {sentReq.name} 
                                                </Typography>
                                            
                                                <IconButton aria-label="open profile" /* onClick={} */>
                                                    <CancelOutlinedIcon/>
                                                </IconButton>
                                            </Box>
                                        ))
                                    )}
                                </Stack>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion
                            expanded={expanded === 'received'} 
                            disableGutters
                            elevation={2}
                        >
                            {/* Required for proper expansion/retraction */}
                            <AccordionSummary sx={{ display: 'none' }} /> 
                            <AccordionDetails sx={{ p: 0, backgroundColor: 'background.lighter' }}>
                                <Stack direction="row" sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    py: 0.3,
                                    px: 5,
                                }}>
                                    {receivedReqs.length == 0 ? (
                                        <Typography align="center" sx={{py: 2}}>
                                            You have no incoming requests
                                        </Typography>
                                    ) : (
                                        sentReqs.map((sentReq) => (
                                            <Box key={sentReq.id}>
                                                <Typography sx={{py: 0.7, flex: 5}}>
                                                    {sentReq.name} 
                                                </Typography>

                                                <Stack direction="row" spacing={1} sx={{flex: 1}}>
                                                    <IconButton aria-label="accept request" /* onClick={} */>
                                                        <CheckIcon/>
                                                    </IconButton>

                                                    <IconButton aria-label="deny request" /* onClick={} */>
                                                        <CancelOutlinedIcon/>
                                                    </IconButton>
                                                </Stack>
                                            </Box>
                                        ))
                                    )}
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                        
                        <Stack>
                            {friends.length == 0 ? (
                                <Typography align="center" sx={{py: 3, color: "theme.secondary"}}>
                                    You currently have no friends
                                </Typography>
                            ) : (
                                friends.map((friend) => (
                                <Box key={friend.id}> {/* exists only to contain the enclosed elements in a single UI elem */}
                                    <Stack direction="row" sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            mt: 1,
                                            py: 0.3,
                                            px: 5,
                                    }}>
                                        
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
                                    <Divider variant="fullWidth" sx={{ borderBottomWidth: 2 }}/>
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