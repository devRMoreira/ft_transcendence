"use client"

import { Container, Box, CircularProgress, Stack, Typography, Paper, Divider } from "@mui/material";
import { getUserData } from "../../services/profile";
import { useEffect, useState } from "react";

export default function SearchPage()
{
    const [userData, setUserData] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUserProfile()
        {
            try {
                const data = await getUserData()
                setUserData(data);
            }
            finally {
                setLoading(false);
            }
        }
        loadUserProfile()
    }, [])

    if (loading) return (
        <Container maxWidth="md">
            <Box sx={{
                minHeight: "100dvh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}></Box>
        </Container>
        );

    const joinDateOnly = userData.createdAt ? new Date(userData.createdAt).toISOString().split("T")[0] : "Unknown";

    return(
        <Container maxWidth="md">
            <Box sx={{
                minHeight: "100dvh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Paper sx={{ width: "100%" }}>
                    <Stack spacing={3} sx={{ p:4 }}>
                        <Typography component="h1" variant="h3">
                            {userData.name}
                        </Typography>

                        <Divider variant="fullWidth" sx={{ borderBottomWidth: 3 }}></Divider>

                        <Stack>
                            <Typography sx={{color: 'text.secondary'}} /* component="h2" variant="h6" */>
                                Joined on
                            </Typography>
                            <Typography>
                                {joinDateOnly}
                            </Typography>
                        </Stack>

                        <Stack>
                            <Typography sx={{color: 'text.secondary'}} /* component="h2" variant="h6" */>
                                Email
                            </Typography>
                            <Typography>
                                {userData.email}
                            </Typography>
                        </Stack>
                    </Stack>
                </Paper>
            </Box>
        </Container>
    );

}


