"use client"

import { Box, Button, Container, Grid, Icon, Table, TableBody, TableContainer, TableHead, TextField, Drawer, Stack, FormControl, FormLabel, RadioGroup, FormHelperText, FormControlLabel, Radio, Checkbox, MenuItem, Select, InputLabel } from "@mui/material";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckIcon from '@mui/icons-material/Check';
import CardDisplay from "./card";
import { getSearchParams } from "../../services/search";
import { getCards } from "../../services/cards";

import { useEffect, useState } from "react";

// const cards = [
//     { name: "...", type: "...", description: "...", 
//   imageUrl: "/cards/....png", 
//   atk: 0, def: 0, spd: 0, wis: 0 },
//     { name: "...", type: "...", description: "...", 
//   imageUrl: "/cards/....png", 
//   atk: 0, def: 0, spd: 0, wis: 0 }
// ];

// const card = { name: "SampleName", type: "...", description: "...", 
//   imageUrl: "https://www.masmusculo.com/100941-thickbox_default/monster-energy.jpg", 
//   atk: 100, def: 100, spd: 100, wis: 100 }

const RARITY_OPTIONS = ["amethyst", "platinum", "gold", "silver"]

export default function SearchPage()
{
    //loading card data
    const [cards, setCards] = useState([])
    //toggles drawer on click
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [formState, setFormState] = useState({
        rarities: [],
        sortBy: "id",
    })
    const [appliedParams, setAppliedParams] = useState([formState])

    const handleRarityChange = (event) => {
        const { target: { value } } = event;
        setFormState((prev) => ({
            ...prev,
            rarities: typeof value === "string" ? value.split(",") : value,
        }));
    };

    const handleApplyFilters = (e) => {
        if (e) e.preventDefault();
        setAppliedFilters(formState);
    };

    useEffect(() => {
        async function loadCards()
        {
            //try
            const cardData = await getCards(appliedParams)
            setCards(cardData)
            //catch
        }
        loadCards()
    }, [appliedParams])

    const toggleDrawer = (open) => () => {
        setIsDrawerOpen(open);
    };

    return(
        <Container maxWidth="xl" sx={{p: 0}}>
            <Box sx={{ 
                p: 2,
                display: "flex",
                justifyContent: "center",
                height: "clamp(10px, 10dvh)",
                width: "100%"
            }}>
                <Button variant="text" color="secondary" startIcon={<KeyboardDoubleArrowDownIcon/>} onClick={toggleDrawer(true)}>
                    Filter
                </Button>
                                <TextField placeholder="Enter card name" sx={{}}/>
                <Button variant="text" color="primary" startIcon={<SearchRoundedIcon/>}>
                    Search
                </Button>

                <Drawer anchor="top" open={isDrawerOpen} onClose={toggleDrawer(false)} spacing={10}>
                    <Stack spacing={1} sx={{p: 3, alignItems: "center",}}>
                        <FormControl placeholder="">
                            <FormLabel sx={{py: 1, alignText: "center"}}>Filter by Rarity</FormLabel>
                                <FormControlLabel label="Silver" control={<Checkbox value="silver" checked={true} /*onChange={}*/ color="primary"/> }/>
                                <FormControlLabel label="Gold" control={<Checkbox value="gold" checked={true} /*onChange={}*/ color="primary"/> }/>
                                <FormControlLabel label="Platinum" control={<Checkbox value="platinum" checked={true}  /*onChange={}*/ color="primary"/> }/>
                                <FormControlLabel label="Amethyst" control={<Checkbox value="amethyst" checked={true}  /*onChange={}*/ color="primary"/> }/>
                            <FormHelperText></FormHelperText>
                        </FormControl>
                        <FormControl sx={{py: 0.8, width: "clamp(150px, 10dvw, 170px)"}}>
                            <InputLabel>Order by Stats</InputLabel>
                              <Select label="Order by Stats">
                                <MenuItem /* value={ascAtk} */><ArrowDropDownIcon/> ATK</MenuItem>
                                <MenuItem /* value={descAtk} */><ArrowDropUpIcon/> ATK</MenuItem>

                                <MenuItem /* value={descDef} */><ArrowDropUpIcon/> DEF</MenuItem>
                                <MenuItem /* value={ascDef} */><ArrowDropDownIcon/> DEF</MenuItem>

                                <MenuItem /* value={descSpd} */><ArrowDropUpIcon/> SPD</MenuItem>
                                <MenuItem /* value={ascSpd} */><ArrowDropDownIcon/> SPD</MenuItem>

                                <MenuItem /* value={descWis} */><ArrowDropUpIcon/> WIS</MenuItem>
                                <MenuItem /* value={ascWis} */><ArrowDropDownIcon/> WIS</MenuItem>
                                
                                <MenuItem /* value={descRar} */><ArrowDropUpIcon/> Rarity</MenuItem>
                                <MenuItem /* value={ascRar} */><ArrowDropDownIcon/> Rarity</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="text" color="secondary" startIcon={<CheckIcon/>} sx={{width: "clamp(150px, 10dvw, 170px)"}}>
                            Apply
                        </Button>
                    </Stack>
                </Drawer>
            </Box>
            <Grid container spacing={0.5}  sx={{ p: 0, justifyContent: "center",}}>
                {cards.map((card) => (
                    <Grid key={card.id}>
                        <CardDisplay
                            name={card.name}
                            rarity={card.rarity}
                            atk={card.atk}
                            def={card.def}
                            spd={card.spd}
                            wis={card.wis}
                            imageUrl={card.imageUrl}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}