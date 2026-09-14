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
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { getFriends, getPendingReqSent, getPendingReqReceived, getFriendStatus, sendFriendReq, acceptFriendReq } from "../../services/friends";
import { useEffect, useState } from "react";
import { ExpandMore } from '@mui/icons-material'

export default function SearchPage()
{
    const [expanded, setExpanded] = useState(false);

    const handleAccordionToggle = (panel) => {
        setExpanded((prev) => (prev === panel ? false : panel))
    }

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
                                    py: 1,
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
                                    <Typography sx={{py: 0.7, flex: 5}}>
                                        Sent Request
                                    </Typography>
                                    
                                    <IconButton aria-label="open profile" /* onClick={} */>
                                        <CancelOutlinedIcon/>
                                    </IconButton>
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
                                    <Typography sx={{py: 0.7, flex: 5}}>
                                        Received request 
                                    </Typography>

                                    <Stack direction="row" spacing={1} sx={{flex: 1}}>
                                        <IconButton aria-label="open profile" /* onClick={} */>
                                            <CheckIcon/>
                                        </IconButton>

                                        <IconButton aria-label="invite to game" /* onClick={} */>
                                            <CancelOutlinedIcon/>
                                        </IconButton>
                                    </Stack>
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                        
                        <Stack>
                            <Stack direction="row" sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mt: 1,
                                    py: 0.3,
                                    px: 5,
                            }}>
                                <Typography sx={{flex: 5}}>
                                    Friend Name
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