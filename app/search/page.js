"use client"

const cards = [
    { name: "...", type: "...", description: "...", 
  imageUrl: "/cards/....png", 
  atk: 0, def: 0, spd: 0, wis: 0 },
    { name: "...", type: "...", description: "...", 
  imageUrl: "/cards/....png", 
  atk: 0, def: 0, spd: 0, wis: 0 }
];

const card = { name: "SampleName", type: "...", description: "...", 
  imageUrl: "https://www.masmusculo.com/100941-thickbox_default/monster-energy.jpg", 
  atk: 100, def: 100, spd: 100, wis: 100 }


import { Box, Button, Container, Grid, Icon, Table, TableBody, TableContainer, TableHead, TextField } from "@mui/material";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CardDisplay from "./card";

export default function SearchPage()
{
    return(
        <Container maxWidth="xl" sx={{p: 0}}>
            <Box sx={{ 
                p: 2,
                display: "flex",
                justifyContent: "center",
                height: "clamp(10px, 10dvh)",
                width: "100%"
            }}>
                <Button variant="contained">
                    <SearchRoundedIcon></SearchRoundedIcon>
                </Button>
                <TextField placeholder="Search card names" sx={{}}/>
            </Box>
            <Grid container spacing={0.5}  sx={{
                p: 0,
                justifyContent: "center",
            }}>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
                <Grid>
                    <CardDisplay/>
                </Grid>
           </Grid>
        </Container>
    );
}