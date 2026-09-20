"use client"

import { Box, Card, CardContent, CardMedia, Stack, Typography } from "@mui/material";

const rarityColor = {
Amethyst: {
    border: "#a855f7", 
    banner: "#652690 ", 
  },
  Silver: {
    border: "#6f7d86", 
    banner: "#485a68", 
  },
  Gold: {
    border: "#f3c040",
    banner: "#DAA520", // "goldenrod"
  },
  Platinum: {
    border: "#1894B5", 
    banner: "#13667d", 
  },
  Default: {
    border: "gray",
    banner: "gray",
  },
}

export default function CardDisplay({
  name = "Kao",
  imageUrl = "https://www.renshuu.org/i/img/landing_v2/landing_kao.png",
  rarity = "Default",
  atk = 0,
  def = 0,
  spd = 0,
  wis = 0}) 
{
  const cardRarity = rarityColor[rarity] /* || rarityColor.Default */

  return (
      <Card elevation={5} sx={{
        aspectRatio: 5/7,
        width: 'clamp(85px, 8dvw, 110px)',
        border: 2,
        borderColor: cardRarity.border,
        background: "gray",
        display: "flex",
        flexDirection: "column",
        }}>
        <CardMedia component="img" image={"https://www.renshuu.org/i/img/landing_v2/landing_kao.png"} sx={{ // path does not work dynamically
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
              <Box sx={{background: cardRarity.banner, justifyContent: "center", }}>
                <Typography sx={{
                  textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
                  lineHeight: 1.2,
                  textAlign: "center",
                  fontSize: "0.8em",
                  fontWeight: "bold",
                  py: 0.5
                  }}> {/* CARD NAME */}
                  {name}
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
                      {atk}
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
                      {def}
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
                      {spd}
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
                      {wis}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
      </Card>
  );
}

