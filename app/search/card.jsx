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
        width: 'clamp(90px, 8dvw, 220px)',
        border: 2,
        borderColor: "goldenrod",
        background: "gray",
        }}>
        <CardMedia component="img" image={card.imageUrl} sx={{
          aspectRatio: 10/8,
          width: '100%',
          }}/>
          <CardContent sx={{
            p: 0,
            }}>
            <Stack>
              <Box sx={{background: "goldenrod",}}>
                <Typography sx={{
                  lineHeight: 1,
                  textAlign: "center",
                  fontSize: "0.9em",
                  fontWeight: "bold",
                  py: 0.3
                  }}> {/* CARD NAME */}
                  {card.name}
                </Typography>
              </Box>
              <Stack direction="row" sx={{
                fontSize: "0.6rem", "& .MuiTypography-root": { fontSize: "inherit" }}}>
                <Stack sx={{
                  flex: 1,
                  // border: 3,
                  borderColor: "rgba(255,255,255,0.25)",
                  background: '#7f1d1d',
                  textAlign: "center",
                  color: "white",
                  }}>
                  <Typography>
                    ATK
                  </Typography>
                  <Typography sx={{fontWeight: "bold"}}>
                    {card.atk}
                  </Typography>
                </Stack>
                <Stack sx={{
                  flex: 1,
                  // border: 3,
                  borderColor: "rgba(255,255,255,0.25)",
                  background: '#1e3a8a',
                  textAlign: "center",
                  color: "white",
                  }}>
                  <Typography>
                    DEF
                  </Typography>
                  <Typography sx={{fontWeight: "bold"}}>
                    {card.def}
                  </Typography>
                </Stack>
                <Stack sx={{
                  flex: 1,                  
                  // border: 3,
                  borderColor: "rgba(255,255,255,0.25)",
                  background: '#14532d',
                  textAlign: "center",
                  color: "white"
                  }}>
                  <Typography>
                    SPD
                  </Typography>
                  <Typography sx={{fontWeight: "bold"}}>
                    {card.spd}
                  </Typography>
                </Stack>
                <Stack sx={{
                  flex: 1,
                  // border: 3,
                  borderColor: "rgba(255,255,255,0.25)",
                  background: '#581c87',
                  textAlign: "center",
                  color: "white"
                  }}>
                  <Typography>
                    WIS
                  </Typography>
                  <Typography sx={{fontWeight: "bold"}}>
                    {card.wis}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
      </Card>
  );
}