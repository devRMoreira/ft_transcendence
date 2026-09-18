import { Box, Chip, CircularProgress, Stack, Typography } from "@mui/material"
import GameCard from "./GameCard"
import GameCardBack from "./GameCardBack"
import { GameRoundHistory } from "./GameRoundHistory"

function EmptyCardSlot() {
	return (
		<Box sx={styles.emptyCardSlot}>
			<Typography>Waiting...</Typography>
		</Box>
	)
}

export function GamePlayingPhase({ match, you, onPlay }) {
	const { status, round, roundStat, carryOver, scores, hands, plays, log } = match.state
	const opponent = you === "player1" ? "player2" : "player1"

	const youScoreStyle = scores[you] >= scores[opponent] ? "filled" : "outlined"
	const oppScoreStyle = scores[opponent] > scores[you] ? "filled" : "outlined"

	return (
		<Box sx={{ width: "100%", overflowX: "hidden" }}>
			<Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
				Round {round}
			</Typography>

			<Box sx={styles.header.root}>
				<Box sx={styles.header.left}>
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

				<Stack direction="row" spacing={1} sx={styles.header.center}>
					{(carryOver > 0 && round !== 6) && (
						<Chip
							color="warning"
							label={
								<Box sx={{ fontSize: "0.875rem" }}>
									Carryover round worth{" "}
									<Box component="span" sx={styles.header.carryNum}>
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
								<Box component="span" sx={styles.header.sudden}>
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

			<Box sx={styles.field.root}>
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

				<Typography variant="h4" sx={styles.field.vs}>
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
						<GameCardBack disabled label="?" />
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

			<GameRoundHistory log={log} you={you} />
		</Box>
	)
}

const styles = {
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
	emptyCardSlot: {
		width: 140,
		height: 210,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		border: "2px dashed",
		borderRadius: 1,
		color: "text.disabled",
	},
}
