"use client"

import { Container, Box, Button, Dialog, DialogTitle, Stack, Typography, Paper, Divider, Accordion, AccordionSummary, AccordionDetails, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { getUserData, fetchUserMatchHistory } from "@/services/profile";
import { removeFriend } from "@/services/friends";
import { GameRoundHistory } from "@/components/GameRoundHistory"
import { useEffect, useState } from "react";
import { ExpandMore } from '@mui/icons-material'
import { useSearchParams } from "next/navigation";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

export default function LeaderboardPage()
{

    return(
        <Container maxWidth="md">
            <Box sx={{
                mt: 3,
                minHeight: "80dvh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Paper sx={{ width: "100%" }}>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        px: 4, 
                        py: 2, 
                        mt: 1 
                    }}>
                        <Typography component="h1" variant="h4">
                            ACHIEVOS
                        </Typography>
                    </Box>

                    <Divider variant="fullWidth" sx={{ borderBottomWidth: 2 }}></Divider>
                    <Stack spacing={3} sx={{ px:4 , py: 2, }}>
                        <Stack>
                            <Typography sx={{color: 'text.secondary'}}>
                                LEADERBOARD
                            </Typography>
                        </Stack>
                    </Stack>
                </Paper>

            </Box>
        </Container>
    );

}


