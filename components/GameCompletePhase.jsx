import { Box, Typography } from "@mui/material"
import { GameRoundHistory } from "./GameRoundHistory"

export function GameCompletePhase({ match, you }) {
	const { winner, scores, log } = match.state
	const won = winner === you

	console.log(match)
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
				{match.state?.forfeited === true ? (
					"Opponent abandoned the match"
				) : (
					<>
						Final score <br />
						{scores?.player1 !== undefined && scores?.player2 !== undefined
							? you === "player1"
								? `${scores.player1} : ${scores.player2}`
								: `${scores.player2} : ${scores.player1}`
							: "- : -"}
					</>
				)}
			</Typography>

			<GameRoundHistory log={log} you={you} />
		</Box>
	)
}
