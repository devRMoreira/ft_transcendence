"use client"

import { Box, Button, Container, Grid, TextField, Drawer, Stack, FormControl, FormLabel, FormHelperText, FormControlLabel, Checkbox, MenuItem, Select, InputLabel } from "@mui/material";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckIcon from '@mui/icons-material/Check';
import CardDisplay from "../../components/CardDisplay";
import { cardSearchParams } from "../../services/search";
import { useEffect, useState } from "react";

const RARITY_OPTIONS = ["Amethyst", "Platinum", "Gold", "Silver"]

export default function SearchPage()
{
    //loading card data
    const [cards, setCards] = useState([])
    //toggles drawer on click
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    //search/sort fields and their default values 
    const [formState, setFormState] = useState({
        searchQuery: "",
        rarity: ["Amethyst", "Platinum", "Gold", "Silver"],
        sortBy: "name_asc",
    })
    const [appliedParams, setAppliedParams] = useState(formState)

    const handleRarityChange = (event) => {
        const { value, checked } = event.target;
        setFormState((prev) => ({
            ...prev,
            rarity: checked ? [...prev.rarity, value] : prev.rarity.filter((r) => r !== value),
        }));
    };

    const handleSortChange = (event) => {
        setFormState((prev) => ({
            ...prev,
            sortBy: event.target.value,
        }));
    };

    const handleSearchChange = (event) => {
        setFormState((prev) => ({
            ...prev,
            searchQuery: event.target.value,
        }));
    };

    const handleApplyParams = (e) => {
        if (e) e.preventDefault();
        setAppliedParams(formState);
        setIsDrawerOpen(false);
    };

    useEffect(() => {
        async function loadCards()
        {
            //try
            const cardData = await cardSearchParams(appliedParams)
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
                <TextField onChange={handleSearchChange} value={formState.searchQuery} placeholder="Enter card name" sx={{}}/>
                <Button variant="text" color="primary" startIcon={<SearchRoundedIcon/>} onClick={handleApplyParams}>
                    Search
                </Button>

                <Drawer anchor="top" open={isDrawerOpen} onClose={toggleDrawer(false)} spacing={10}>
                    <Stack spacing={1} sx={{p: 3, alignItems: "center",}}>
                        <FormControl component="fieldset">
                            <FormLabel sx={{py: 1, alignText: "center"}}>Filter by Rarity</FormLabel>
                                {RARITY_OPTIONS.map((rar) => (
                                <FormControlLabel 
                                    key={rar}
                                    label={rar} 
                                    control={
                                        <Checkbox 
                                            value={rar} 
                                            checked={formState.rarity.includes(rar)} 
                                            onChange={handleRarityChange} 
                                            color="primary"
                                        /> 
                                    }
                                />
                                ))}
                            <FormHelperText></FormHelperText>
                        </FormControl>
                        <FormControl sx={{py: 0.8, width: "clamp(150px, 10dvw, 170px)"}}>
                            <InputLabel>Order by Stats</InputLabel>
                              <Select label="Order by Stats" value={formState.sortBy} onChange={handleSortChange}>
                                <MenuItem value="name_asc"><ArrowDropDownIcon/> Name </MenuItem>
                                <MenuItem value="name_desc"><ArrowDropUpIcon/> Name </MenuItem>

                                <MenuItem value="atk_asc"><ArrowDropDownIcon/> ATK </MenuItem>
                                <MenuItem value="atk_desc"><ArrowDropUpIcon/> ATK </MenuItem>

                                <MenuItem value="def_asc"><ArrowDropDownIcon/> DEF </MenuItem>
                                <MenuItem value="def_desc"><ArrowDropUpIcon/> DEF </MenuItem>

                                <MenuItem value="spd_asc"><ArrowDropDownIcon/> SPD </MenuItem>
                                <MenuItem value="spd_desc"><ArrowDropUpIcon/> SPD </MenuItem>

                                <MenuItem value="wis_asc"><ArrowDropDownIcon/> WIS </MenuItem>
                                <MenuItem value="wis_desc"><ArrowDropUpIcon/> WIS </MenuItem>

                                <MenuItem value="rarity_asc"><ArrowDropDownIcon/> Rarity </MenuItem>
                                <MenuItem value="rarity_desc"><ArrowDropUpIcon/> Rarity </MenuItem>
                            </Select>
                        </FormControl>
                        <Button onClick={handleApplyParams} variant="text" color="secondary" startIcon={<CheckIcon/>} sx={{width: "clamp(150px, 10dvw, 170px)"}}>
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