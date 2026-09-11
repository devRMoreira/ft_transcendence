"use client"

import { Box, Button, Typography, Stack, Chip, Paper, CircularProgress } from "@mui/material"
import CasinoIcon from "@mui/icons-material/Casino"
import GameCard from "@/components/GameCard"
import CardBack from "@/components/CardBack"

export function RoundHistory({ log, you }) {
	const opponent = you === "player1" ? "player2" : "player1"
	const rounds = log || []

	if (rounds.length === 0) return null

	return (
		<Box sx={roundStyles.root}>
			<Typography sx={roundStyles.rootTitle}>Round History</Typography>

			<Stack spacing={1}>
				{rounds.map((entry) => {
					const isWin = entry.winner === you
					const isLoss = entry.winner === opponent

					const chipTheme = isWin ? "success" : isLoss ? "error" : "default"
					const chipLabel = isWin ? "WON" : isLoss ? "LOST" : "TIE"

					const youStatTheme = isWin
						? roundStyles.body.youStatWin
						: roundStyles.body.youStatLoss

					const oppStatTheme = isLoss
						? roundStyles.body.oppStatWin
						: roundStyles.body.oppStatLoss

					const roundTheme = isWin
						? roundStyles.body.rootWin
						: isLoss
							? roundStyles.body.rootLoss
							: roundStyles.body.rootTie

					const youCard = entry.plays[you]
					const oppCard = entry.plays[opponent]

					return (
						<Paper key={entry.round} variant="outlined" sx={roundTheme}>
							<Typography variant="caption" sx={roundStyles.body.title}>
								ROUND {entry.round} - {entry.stat.toUpperCase()}
							</Typography>

							<Box sx={roundStyles.body.box}>
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
									sx={roundStyles.body.chip}
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

function EmptyCardSlot() {
	return (
		<Box sx={emptyCardStyle}>
			<Typography>Waiting...</Typography>
		</Box>
	)
}

export function ChoosingPhase({ match, you, onChoose }) {
	const { rollWinner } = match.state

	if (you !== rollWinner) {
		return (
			<Box sx={{ textAlign: "center", mt: 6 }}>
				<CasinoIcon sx={{ fontSize: 48, mb: 1 }} />

				<Typography>Waiting for your opponent to choose their advantage...</Typography>
			</Box>
		)
	}

	return (
		<Box sx={{ textAlign: "center", mt: 4 }}>
			<CasinoIcon sx={{ fontSize: 56, color: "primary.main", mb: 1 }} />

			<Typography variant="h5" gutterBottom>
				You won the roll!
			</Typography>

			<Typography sx={{ mb: 3 }}>Choose your advantage:</Typography>

			<Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
				<Button variant="contained" size="large" onClick={() => onChoose("firstPick")}>
					First draft pick
				</Button>

				<Button variant="outlined" size="large" onClick={() => onChoose("token")}>
					Priority token
				</Button>
			</Stack>
		</Box>
	)
}

export function DraftingPhase({ match, you, onPick }) {
	const { pool, turn, hands, picksRemaining } = match.state
	const isYourTurn = turn === you

	return (
		<Box>
			<Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
				{isYourTurn ? "Your turn to pick" : "Waiting for opponent's pick..."}
				<br />
				{picksRemaining[you]} remaining
			</Typography>

			<Stack
				direction="row"
				spacing={1}
				sx={{ mb: 4, flexWrap: "wrap", justifyContent: "center" }}
			>
				{pool.map((slot) =>
					slot.claimedBy === you ? (
						<GameCard key={slot.slotId} card={slot.card} disabled />
					) : (
						<CardBack
							key={slot.slotId}
							disabled={!isYourTurn || Boolean(slot.claimedBy)}
							label={slot.claimedBy ? "Taken" : undefined}
							onClick={() => onPick(slot.slotId)}
						/>
					)
				)}
			</Stack>

			<Typography sx={{ mt: 1, textAlign: "center" }} gutterBottom>
				Your hand so far
			</Typography>

			<Stack direction="row" gap={1.5} sx={{ flexWrap: "wrap", justifyContent: "center" }}>
				{hands[you].map((c) => (
					<GameCard key={c.instanceId} card={c} />
				))}
			</Stack>
		</Box>
	)
}

export function PlayingPhase({ match, you, onPlay }) {
	const { status, round, roundStat, carryOver, scores, hands, plays, log } = match.state
	const opponent = you === "player1" ? "player2" : "player1"

	const youScoreStyle = scores[you] >= scores[opponent] ? "filled" : "outlined"
	const oppScoreStyle = scores[opponent] > scores[you] ? "filled" : "outlined"

	return (
		<Box sx={{ width: "100%", overflowX: "hidden" }}>
			<Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
				Round {round}
			</Typography>

			<Box sx={playStyles.header.root}>
				<Box sx={playStyles.header.left}>
					{status === "rolling" && (
						<Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
							<CircularProgress size={20} />

							<Typography color="text.secondary">Rolling...</Typography>
						</Stack>
					)}

					{status !== "rolling" && roundStat && (
						<Typography>
							Stat in play:{" "}
							<Box component={"span"} sx={{ fontWeight: 700, color: "primary.main" }}>
								{roundStat.toUpperCase()}
							</Box>
						</Typography>
					)}
				</Box>

				<Stack direction="row" spacing={1} sx={playStyles.header.center}>
					{carryOver > 0 && (
						<Chip
							color="warning"
							label={
								<Box sx={{ fontSize: "0.875rem" }}>
									Carryover round worth{" "}
									<Box component="span" sx={playStyles.header.carryNum}>
										{1 + carryOver}
									</Box>{" "}
									points
								</Box>
							}
						/>
					)}

					{round === 6 && (
						<Chip
							color="error"
							label={
								<Box component="span" sx={playStyles.header.sudden}>
									SUDDEN DEATH
								</Box>
							}
						/>
					)}
				</Stack>

				<Stack
					direction="row"
					spacing={1}
					sx={{ justifyContent: { xs: "center", sm: "flex-end" } }}
				>
					<Chip
						label={`You:${scores[you]}`}
						color="primary"
						sx={{ letterSpacing: 0.5, fontSize: "0.8rem" }}
						variant={youScoreStyle}
					/>

					<Chip
						label={`Opp:${scores[opponent]}`}
						sx={{ letterSpacing: 0.5, fontSize: "0.8rem" }}
						variant={oppScoreStyle}
					/>
				</Stack>
			</Box>

			<Box sx={playStyles.field.root}>
				<Box sx={{ textAlign: "center" }}>
					<Typography variant="caption" color="text.secondary" display="block">
						You
					</Typography>

					{plays[you] ? (
						<GameCard card={plays[you]} highlightStat={roundStat} display />
					) : (
						<EmptyCardSlot />
					)}
				</Box>

				<Typography variant="h4" sx={playStyles.field.vs}>
					VS
				</Typography>

				<Box sx={{ textAlign: "center" }}>
					<Typography
						variant="caption"
						color="text.secondary"
						display="block"
						gutterBottom
					>
						Opponent
					</Typography>

					{plays[opponent] === true ? (
						<CardBack disabled label="?" />
					) : plays[opponent] ? (
						<GameCard card={plays[opponent]} highlightStat={roundStat} display />
					) : (
						<EmptyCardSlot />
					)}
				</Box>
			</Box>

			<Typography sx={{ textAlign: "center" }} gutterBottom>
				Your hand
			</Typography>

			<Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", justifyContent: "center" }}>
				{hands[you].map((c) => (
					<GameCard
						key={c.instanceId}
						card={c}
						highlightStat={roundStat}
						onClick={() => onPlay(c.instanceId)}
						disabled={status !== "playing" || plays[you]}
					/>
				))}
			</Stack>

			<RoundHistory log={log} you={you} />
		</Box>
	)
}

export function CompletePhase({ match, you }) {
	const { winner, scores, log } = match.state
	const won = winner === you

	return (
		<Box sx={{ textAlign: "center", mt: 4 }}>
			<Typography
				variant="h3"
				fontWeight={700}
				gutterBottom
				color={won ? "success" : "error"}
			>
				{won ? "Victory!" : "Defeat"}
			</Typography>

			<Typography variant="h6" color="text.secondary" gutterBottom>
				Final score <br />
				{scores.player1} : {scores.player2}
			</Typography>

			<RoundHistory log={log} you={you} />
		</Box>
	)
}

const roundStyles = {
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

const emptyCardStyle = {
	width: 140,
	height: 210,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	border: "2px dashed",
	borderRadius: 1,
	color: "text.disabled",
}

const playStyles = {
	header: {
		root: {
			display: "grid",
			gridTemplateColumns: { xs: "1fr", sm: "1fr auto 1fr" },
			gap: 1.5,
			alignItems: "center",
			width: "100%",
			mb: 2,
		},
		left: { display: "flex", justifyContent: { xs: "center", sm: "flex-start" } },
		center: { alignItems: "center", justifyContent: "center" },
		carryNum: { fontWeight: 900, fontSize: "1rem", textDecoration: "underline" },
		sudden: { fontSize: "0.875rem", fontWeight: 800, letterSpacing: 0.5 },
	},
	field: {
		root: {
			display: "flex",
			flexDirection: { xs: "column", sm: "row" },
			justifyContent: "space-around",
			alignItems: "center",
			gap: 2,
			my: 3,
			p: { xs: 2, sm: 3 },
			border: "2px solid",
			borderColor: "primary.main",
			borderRadius: 2,
		},
		vs: { color: "primary.main", opacity: 0.6, my: { xs: 1, sm: 0 } },
	},
}
