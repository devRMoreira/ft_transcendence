import { Box, Button, Stack, Typography } from "@mui/material"
import CasinoIcon from "@mui/icons-material/Casino"

export function GameChoosingPhase({ match, you, onChoose }) {
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
