"use client"

import { Card, Typography } from "@mui/material"

export default function GameCardBack({ onClick, disabled, label }) {
	const clickable = Boolean(onClick) && !disabled

	return (
		<Card
			variant="outlined"
			onClick={clickable ? onClick : undefined}
			sx={{
				width: 140,
				height: 210,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				cursor: clickable ? "pointer" : "default",
				bgcolor: disabled ? "action.disabledBackground" : "primary.main",
				color: "primary.contrastText",
				transition: "transform 0.15s ease, box-shadow 0.15s ease",
				...(clickable && {
					"&:hover": { transform: "translateY(-4px) scale(1.03)", boxShadow: 4 },
				}),
			}}
		>
			<Typography variant="h5" sx={{ opacity: 0.85 }}>
				{label ?? "?"}
			</Typography>
		</Card>
	)
}
