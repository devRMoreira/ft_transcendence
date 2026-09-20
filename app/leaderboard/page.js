"use client"

import { Container, Box, Stack, Typography, Paper, Divider } from "@mui/material";
import { fetchLeaderboard } from "@/services/leaderboard";
import { useEffect, useState } from "react";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

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
                            Leaderboard
                        </Typography>
                    </Box>

                    <Divider variant="fullWidth" sx={{ borderBottomWidth: 2 }}></Divider>
                    <Stack spacing={3} sx={{ px:4 , py: 2, }}>
                        <Typography sx={{color: 'text.secondary'}}>
                            LEADERBOARD
                        </Typography>
                    </Stack>
                </Paper>

            </Box>
        </Container>
    );

}


