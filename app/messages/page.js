"use client"

import { Container, Box, Stack, Typography, Paper, Divider, Button, IconButton, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import StyleIcon from '@mui/icons-material/Style';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { getConversationList, getMessageHistory, sendMessage } from "../../services/messages.js";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

export default function MessagesPage()
{
    const searchParams = useSearchParams()
    const targetUserId = searchParams.get("targetUserId")
    const targetUserName = searchParams.get("targetName")

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
            const data = ( await getConversationList() ) || []
            setConversationList(data)

            if (targetUserId)
            {
                const existingChat = data.find((c) => c.partner?.id === targetUserId)

                if (existingChat)
                    setSelectedPartner(existingChat.partner)
                else{
                    setSelectedPartner({
                        id: targetUserId,
                        name: targetUserName || "User",
                        isDraft: true,
                    })
                }
            } 
            else if (data.length > 0) {
                setSelectedPartner(data[0].partner)
            }

            setLoadingConversationList(false)
        }
        loadConversationList()
    }, [targetUserId, targetUserName])

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

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!messageText.trim() || !selectedPartner?.id || sending)
            return

        setSending(true)
        try {
            const response = await sendMessage(selectedPartner.id, messageText)

            const newMsg = response || {
                id: Date.now(),
                content: messageText,
                sender: { id: "current-user", name: "You"}
            }

            setMessageHistory((prev) => [...prev, newMsg])

            setConversationList((prev) => {
                const alreadyExists = prev.some((item) => item.partner.id === selectedPartner.id)

                if(alreadyExists) {
                    return prev.map((item) =>
                        item.partner.id === selectedPartner.id ? { ...item, lastMessage: { id: newMsg.id, content: messageText}}
                        : item
                    )
                }

                return [
                    {
                        partner: selectedPartner,
                        lastMessage: { id: newMsg.id, content: messageText }
                    },
                    ...prev
                ]
            })

            setMessageText("")
        } 
        catch (error) {
            console.error("Failed to send message:", error);
        } 
        finally {
            setSending(false);
        }
    }

    return(
        <Container maxWidth="lg">
            <Box sx={{
                minHeight: "100dvh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Paper sx={{ width: "100%", height: "80dvh", display: "flex", overflow: "hidden"}}>
                    <Stack direction="row" sx={{ width: "100%", display: "flex", }}>

                        {/* LEFT PANE WITH CONVERSATION LIST */}

                        <Stack divider={<Divider flexItem variant="fullWidth" sx={{ borderBottomWidth: 2 }}/>} sx={{flex: 1, overflowY: "auto", }}>
                            {conversationList.length == 0 ? (
                                <Typography sx={{px: 2, py: 1.7}}>
                                    No chats to show
                                </Typography>
                            ) : (
                                conversationList.map((conversation) => (
                                    <Box key={conversation.lastMessage.id}>
                                        <Stack onClick={() => setSelectedPartner(conversation.partner)} sx={{
                                            py: 1.5,
                                            px: 2,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            backgroundColor: selectedPartner?.id === conversation.partner.id ? 'action.selected' : 'transparent',
                                        }}>
                                            <Typography>
                                                {conversation.partner.name}
                                            </Typography>
                                            <Typography noWrap sx={{ fontSize: "0.9rem"}}>
                                                {conversation.lastMessage.content}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                ))
                            )}
                        </Stack>

                        <Divider orientation="vertical" flexItem variant="fullWidth" sx={{ borderRightWidth: 2 }} />

                        {/* RIGHT PANE WITH SINGLE CONVERSATION */}

                        <Box sx={{ py: 1, px: 2, flex: 3, display: "flex", flexDirection: "column", height: "100%"}}>
                            <Box sx={{display: "flex", flex: 1, overflowY: "auto", flexDirection: "column", minHeight: 0, mb: 1.5, }}>
                                <Stack direction="row" spacing={0.5} sx={{ width: "100%", alignItems: "center"}}>
                                    <Typography sx={{pr: 2, fontWeight: 700}}>
                                        Chat with {selectedPartner?.name}
                                    </Typography>
                                    <IconButton aria-label="invite to game">
                                        <AccountBoxIcon/>
                                    </IconButton>
                                    <IconButton aria-label="invite to game">
                                        <StyleIcon/>
                                    </IconButton>
                                </Stack>
                                <Box sx={{ flex: 1, overflowY: "auto", mt: 1, py: 1.5, px:2, backgroundColor: "background.lighter"}}>
                                    {messageHistory.map((msg) => (
                                        <Stack key={msg.id}>
                                            <Typography sx={{fontSize: "0.9rem", color: msg.sender.id == selectedPartner?.id ? "text.primary" : "#BBBBBB"}}>
                                                <strong>{msg.sender.name}:</strong> {msg.content}
                                            </Typography>
                                        </Stack>                                
                                    ))}
                                    <div ref={messagesEndRef} />
                                </Box>
                            </Box>
                            <Stack onSubmit={handleSendMessage} spacing={1.5} component="form" direction="row" sx={{
                                pb: 0.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <TextField
                                    fullWidth
                                    placeholder="send a message"
                                    variant="outlined"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    disabled={sending || !selectedPartner}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    endIcon={<SendIcon />}
                                    disabled={sending || !messageText.trim() || !selectedPartner}
                                    sx={{ whiteSpace: 'nowrap' }}
                                >
                                    send
                                </Button>
                            </Stack>
                        </Box>

                    </Stack>
                </Paper>
            </Box>
        </Container>
    );

}    