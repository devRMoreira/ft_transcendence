import { Box, Chip, Paper, Stack, Typography } from "@mui/material"

export function GameRoundHistory({ log, you }) {
	const opponent = you === "player1" ? "player2" : "player1"
	const rounds = log || []

	if (rounds.length === 0) return null

	return (
		<Box sx={styles.root}>
			<Typography sx={styles.rootTitle}>Round History</Typography>

			<Stack spacing={1}>
				{rounds.map((entry) => {
					const isWin = entry.winner === you
					const isLoss = entry.winner === opponent

					const chipTheme = isWin ? "success" : isLoss ? "error" : "default"
					const chipLabel = isWin ? "WON" : isLoss ? "LOST" : "TIE"

					const youStatTheme = isWin ? styles.body.youStatWin : styles.body.youStatLoss

					const oppStatTheme = isLoss ? styles.body.oppStatWin : styles.body.oppStatLoss

					const roundTheme = isWin
						? styles.body.rootWin
						: isLoss
							? styles.body.rootLoss
							: styles.body.rootTie

					const youCard = entry.plays[you]
					const oppCard = entry.plays[opponent]

					return (
						<Paper key={entry.round} variant="outlined" sx={roundTheme}>
							<Typography variant="caption" sx={styles.body.title}>
								ROUND {entry.round} - {entry.stat.toUpperCase()}
							</Typography>

							<Box sx={styles.body.box}>
								<Box sx={{ textAlign: "right" }}>
									<Typography
										variant="body2"
										component="span"
										sx={{ fontWeight: 700 }}
									>
										{youCard?.name}{" "}
									</Typography>

									<Box component="span" sx={youStatTheme}>
										({youCard?.[entry.stat]})
									</Box>
								</Box>

								<Chip
									size="small"
									label={chipLabel}
									color={chipTheme}
									sx={styles.body.chip}
								/>

								<Box sx={{ textAlign: "left" }}>
									<Box component="span" sx={oppStatTheme}>
										({oppCard?.[entry.stat]})
									</Box>{" "}
									<Typography
										variant="body2"
										component="span"
										sx={{ fontWeight: 700 }}
									>
										{oppCard?.name}
									</Typography>
								</Box>
							</Box>
						</Paper>
					)
				})}
			</Stack>
		</Box>
	)
}

const styles = {
	root: { maxWidth: 480, mx: "auto", mt: 4 },
	rootTitle: { textAlign: "center", mb: 2 },
	body: {
		rootWin: { p: 1.5, borderRadius: 2, border: "1px solid", borderColor: "success.main" },
		rootTie: { p: 1.5, borderRadius: 2, border: "1px solid", borderColor: "grey.500" },
		rootLoss: { p: 1.5, borderRadius: 2, border: "1px solid", borderColor: "error.main" },
		title: {
			fontWeight: 700,
			color: "text.secondary",
			display: "block",
			textAlign: "center",
			mb: 1,
		},
		box: { display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 1 },
		youStatWin: {
			display: "inline-block",
			minWidth: "4ch",
			textAlign: "center",
			fontVariantNumeric: "tabular-nums",
			fontSize: "0.75rem",
			color: "success.main",
			fontWeight: 800,
		},
		youStatLoss: {
			display: "inline-block",
			minWidth: "4ch",
			textAlign: "center",
			fontVariantNumeric: "tabular-nums",
			fontSize: "0.75rem",
			color: "text.secondary",
			fontWeight: 500,
		},
		oppStatWin: {
			display: "inline-block",
			minWidth: "4ch",
			textAlign: "center",
			fontVariantNumeric: "tabular-nums",
			fontSize: "0.75rem",
			color: "error.main",
			fontWeight: 800,
		},
		oppStatLoss: {
			display: "inline-block",
			minWidth: "4ch",
			textAlign: "center",
			fontVariantNumeric: "tabular-nums",
			fontSize: "0.75rem",
			color: "text.secondary",
			fontWeight: 500,
		},
		chip: {
			fontWeight: 800,
			fontSize: "0.65rem",
			height: 22,
			width: 52,
			"& .MuiChip-label": { px: 0, width: "100%", textAlign: "center" },
		},
	},
}
