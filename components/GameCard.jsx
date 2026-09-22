"use client"

import { Card, Typography, Box } from "@mui/material"

const STAT_LABELS = { atk: "ATK", def: "DEF", spd: "SPD", wis: "WIS" }

const RARITY_COLORS = {
	Amethyst: { border: "#a855f7" },
	Silver: { border: "#6f7d86" },
	Gold: { border: "#f3c040" },
	Platinum: { border: "#1894B5" },
	Default: { border: "rgba(255, 255, 255, 0.15)" },
}

export default function GameCard({ card, highlightStat, onClick, disabled, display }) {
	const clickable = Boolean(onClick) && !disabled && !display
	const rarityStyle = RARITY_COLORS[card?.rarity] || RARITY_COLORS.Default

	return (
		<Card
			elevation={0}
			onClick={clickable ? onClick : undefined}
			sx={{
				width: 145,
				height: 225,
				display: "flex",
				flexDirection: "column",
				cursor: clickable ? "pointer" : "default",
				opacity: disabled ? 0.4 : 1,
				borderRadius: 2.5,
				bgcolor: "#22252e",
				border: "2px solid",
				borderColor: rarityStyle.border,
				overflow: "hidden",
				userSelect: "none",
				transition: "all 0.2s ease",
				...(clickable && {
					"&:hover": {
						transform: "translateY(-6px)",
						boxShadow: `0 8px 20px ${rarityStyle.border}40`,
					},
				}),
			}}
		>
			<Box
				sx={{
					width: "100%",
					height: 125,
					p: 1,
					boxSizing: "border-box",
				}}
			>
				<Box
					component="img"
					src={card.imageUrl}
					alt={card.name}
					sx={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
						borderRadius: 1.5,
					}}
				/>
			</Box>
			<Box
				sx={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					p: 1.25,
					pt: 0.25,
					boxSizing: "border-box",
				}}
			>
				<Typography
					variant="subtitle2"
					noWrap
					align="center"
					sx={{
						fontWeight: 700,
						fontSize: "0.85rem",
						color: "text.primary",
					}}
				>
					{card.name}
				</Typography>

				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						columnGap: 1.5,
						rowGap: 0.5,
					}}
				>
					{Object.entries(STAT_LABELS).map(([key, label]) => {
						const isHighlighted = Boolean(display) && highlightStat === key
						const statStyle = {
							color: isHighlighted ? "primary.main" : "text.secondary",
							fontWeight: isHighlighted ? 700 : 400,
							fontSize: "0.8rem",
						}

						return (
							<Box
								key={key}
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<Typography sx={statStyle}>{label}</Typography>
								<Typography sx={statStyle}>{card[key]}</Typography>
							</Box>
						)
					})}
				</Box>
			</Box>
		</Card>
	)
}
