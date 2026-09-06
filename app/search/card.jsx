"use client"

import { Box, Button, ButtonGroup, Card, CardActions, CardContent, CardMedia, Container, Grid, Stack, Typography } from "@mui/material";

const card = { name: "Kao", type: "rare", description: "...", 
  imageUrl: "https://www.renshuu.org/i/img/landing_v2/landing_kao.png", 
  atk: 100, def: 100, spd: 100, wis: 100 }

export default function CardDisplay()
{
  return (
      <Card elevation={5} sx={{
        aspectRatio: 5/7,
        width: 'clamp(85px, 8dvw, 95px)',
        border: 2,
        borderColor: "goldenrod",
        background: "gray",
        display: "flex",
        flexDirection: "column",
        }}>
        <CardMedia component="img" image={card.imageUrl} sx={{
          flex: "0 0 56%", //rougly same as aspectRatio: 5/4,
          }}/>
          <CardContent sx={{
            p: 0,
            "&:last-child": { pb: 0 }, 
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            }}>
            <Stack sx={{ flex: 1, minHeight: 0,}}>
              <Box sx={{background: "goldenrod", justifyContent: "center", }}>
                <Typography sx={{
                  textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
                  lineHeight: 1.2,
                  textAlign: "center",
                  fontSize: "0.8em",
                  fontWeight: "bold",
                  py: 0.3
                  }}> {/* CARD NAME */}
                  {card.name}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, display: "flex", alignItems: "stretch"}}>
                <Stack direction="row" sx={{flex: 1, display: "flex", alignItems: "stretch", width: "100%", fontSize: "0.5rem", "& .MuiTypography-root": { fontSize: "inherit" }}}>
                  <Stack sx={{
                    flex: 1,
                    background: '#7f1d1d',
                    textAlign: "center",
                    color: "white",
                    justifyContent: "center", 
                    }}>
                    <Typography sx={{textShadow: "1px 1px 2px rgba(0,0,0,0.6)",}}>
                      ATK
                    </Typography>
                    <Typography sx={{fontWeight: "bold", textShadow: "1px 1px 2px rgba(0,0,0,0.6)",}}>
                      {card.atk}
                    </Typography>
                  </Stack>
                  <Stack sx={{
                    flex: 1,
                    background: '#1e3a8a',
                    textAlign: "center",
                    color: "white",
                    justifyContent: "center", 
                    }}>
                    <Typography sx={{textShadow: "1px 1px 2px rgba(0,0,0,0.6)",}}>
                      DEF
                    </Typography>
                    <Typography sx={{fontWeight: "bold", textShadow: "1px 1px 2px rgba(0,0,0,0.6)",}}>
                      {card.def}
                    </Typography>
                  </Stack>
                  <Stack sx={{
                    flex: 1,                  
                    background: '#B88A00',
                    textAlign: "center",
                    color: "white",
                    justifyContent: "center", 
                    }}>
                    <Typography sx={{textShadow: "1px 1px 2px rgba(0,0,0,0.6)",}}>
                      SPD
                    </Typography>
                    <Typography sx={{fontWeight: "bold", textShadow: "1px 1px 2px rgba(0,0,0,0.6)",}}>
                      {card.spd}
                    </Typography>
                  </Stack>
                  <Stack sx={{
                    flex: 1,
                    /* background: '#581c87', */
                    background: '#14532d',                    
                    textAlign: "center",
                    color: "white",
                    justifyContent: "center", 
                    }}>
                    <Typography sx={{textShadow: "1px 1px 2px rgba(0,0,0,0.6)",}}>
                      WIS
                    </Typography>
                    <Typography sx={{fontWeight: "bold", textShadow: "1px 1px 2px rgba(0,0,0,0.6)",}}>
                      {card.wis}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
      </Card>
  );
}

