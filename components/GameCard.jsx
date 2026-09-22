"use client"

import { Card, CardContent, CardMedia, Typography, Box, Stack } from "@mui/material"

const STAT_LABELS = { atk: "ATK", def: "DEF", spd: "SPD", wis: "WIS" }

export default function GameCard({ card, highlightStat, onClick, disabled, display }) {
	const clickable = Boolean(onClick) && !disabled && !display

	return (
		<Card
			variant="outlined"
			onClick={clickable ? onClick : undefined}
			sx={{
				width: 140,
				height: 210,
				display: "flex",
				flexDirection: "column",
				cursor: clickable ? "pointer" : "default",
				opacity: disabled ? 0.6 : 1,
				transition: "transform 0.15s ease, box-shadow 0.15s ease",
				...(clickable && {
					"&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
				}),
			}}
		>
			<CardMedia
				component="img"
				image={card.imageUrl}
				alt={card.name}
				sx={{
					height: 56,
					width: 56,
					mx: "auto",
					mt: 1.5,
					objectFit: "contain",
					flexShrink: 0,
				}}
			/>

			<CardContent
				sx={{
					p: 1.5,
					"&:last-child": { pb: 1.5 },
					flex: 1,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
				}}
			>
				<Typography variant="subtitle2" noWrap gutterBottom title={card.name}>
					{card.name}
				</Typography>

				<Stack spacing={0.25}>
					{Object.entries(STAT_LABELS).map(([key, label]) => {
						const isHighlighted = Boolean(display) && highlightStat === key

						const statStyle = {
							color: isHighlighted ? "primary.main" : "text.secondary",
							fontWeight: isHighlighted ? 700 : 400,
						}

						return (
							<Box
								key={key}
								sx={{ display: "flex", justifyContent: "space-between" }}
							>
								<Typography variant="caption" sx={statStyle}>
									{label}
								</Typography>

								<Typography variant="caption" sx={statStyle}>
									{card[key]}
								</Typography>
							</Box>
						)
					})}
				</Stack>
			</CardContent>
		</Card>
	)
}
