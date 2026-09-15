"use client"

import { Container, Box, Stack, Typography, Paper, Divider, Button, IconButton, Popover, Accordion, AccordionSummary, AccordionDetails, Collapse, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import StyleIcon from '@mui/icons-material/Style';
import { getConversationList, getMessageHistory, sendMessage } from "../../services/messages.js";

import { useEffect, useState, useRef } from "react";

export default function messagesPage()
{
    const [conversationList, setConversationList] = useState([])
    const [selectedPartner, setSelectedPartner] = useState(null)
    const [messageHistory, setMessageHistory] = useState([])
    const [messageText, setMessageText] = useState("")

    const [loadingConversationList, setLoadingConversationList] = useState(false)
    const [loadingMessageHistory, setLoadingMessageHistory] = useState(false)
    const [sending, setSending] = useState(false)

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        async function loadConversationList() {
            setLoadingConversationList(true)
            const data = await getConversationList()
            setConversationList(data)
            if (data.length > 0) {
                setSelectedPartner(data[0].partner)
            }
            setLoadingConversationList(false)
        }
        loadConversationList()
    }, [])

    useEffect(() => {
        if (!selectedPartner?.id)
            return

        async function loadTargetUserMessages() {
            setLoadingMessageHistory(true)
            const response = await getMessageHistory(selectedPartner.id)
            setMessageHistory(Array.isArray(response) ? response : response?.data || [])
            setLoadingMessageHistory(false)
        }
        loadTargetUserMessages()
    }, [selectedPartner])

    useEffect(() => {
        scrollToBottom();
    }, [messageHistory]);

    return(
        <Container maxWidth="lg">
            <Box sx={{
                minHeight: "100dvh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Paper sx={{ width: "100%", minHeight: "60dvh", display: "flex"}}>
                    <Stack direction="row" sx={{ width: "100%", display: "flex", }}>
                        <Stack divider={<Divider flexItem variant="fullWidth" sx={{ borderBottomWidth: 2 }}/>} sx={{ flex: 1,}}>
                            {conversationList.map((conversation) =>
                                <Box key={conversation.lastMessage.id}> {/* exists only to contain the enclosed elements in a single UI elem */}
                                    <Stack sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, px: 2 }}>

                                        <Stack direction="row" spacing={1} sx={{ alignItems: "center"}}>
                                            <Typography>
                                                {conversation.partner.name}
                                            </Typography>
                                            <IconButton aria-label="invite to game">
                                                <StyleIcon/>
                                            </IconButton>
                                        </Stack>

                                        <Typography noWrap sx={{pl: 1, fontSize: "0.9rem"}}>
                                            {conversation.lastMessage.content}
                                        </Typography>
                                    </Stack>
                                </Box>
                            )}
                        </Stack>

                        <Divider orientation="vertical" flexItem variant="fullWidth" sx={{ borderRightWidth: 2 }} />

                        <Box sx={{ py: 1.5, px: 2, flex: 3, display: "flex", flexDirection: "column", height: "100%"}}>
                            <Box sx={{display: "flex", flex: 1, overflowY: "auto", flexDirection: "column", minHeight: 0, mb: 1.5, background: "theme.lighter"}}>
                                <Typography sx={{fontWeight: 700}}>
                                    Chat with {selectedPartner?.name}
                                </Typography>
                                <Box sx={{ flex: 1, overflowY: "auto", mt: 1, py: 1, px:2, backgroundColor: 'background.lighter'}}>
                                    {messageHistory.map((msg) => 
                                        <Stack key={msg.id}>
                                            <Typography sx={{fontSize: "0.9rem", color: msg.sender.id == selectedPartner.id ? "#FFFFFF" : "theme.secondary"}}>
                                                {msg.sender.name}: {msg.content}
                                            </Typography>
                                        </Stack>                                
                                    )}
                                </Box>
                            </Box>
                            <Stack /* onSubmit={handleAddFriend} */ component="form" direction="row" sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <TextField
                                    fullWidth
                                    placeholder="Enter email or username..."
                                    variant="outlined"
                                    /* value={} */
                                    /* onChange={} */
                                    /* disabled={loading} */
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<SendIcon />}
                                    /* disabled={loading} */
                                    sx={{ whiteSpace: 'nowrap' }}
                                ></Button>
                            </Stack>
                        </Box>
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