"use client"

import { Container, Box, CircularProgress, Stack, Typography } from "@mui/material";
import { getUserData } from "../../services/profile";
import { useEffect, useState } from "react";

// User Profile
// Frontend - a profile page displaying that info. Display only not editing.

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

    if (loading) return (<Container maxWidth="md" sx={{p: 0,}}></Container>); //basic container

    return(
        <Container maxWidth="md" sx={{p: 0,}}>
            <Stack sx={{p: 1, background: "goldenrod"}}>
                <Typography>{userData.name}</Typography>
                X
                <Typography>{userData.email}</Typography>
                XX
                <Typography>{userData.lastSeen}</Typography>
                XXX
                <Typography>{userData.createdAt}</Typography>
            </Stack>
        </Container>
    );
}