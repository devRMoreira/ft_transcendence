import { Box, Stack, Typography } from "@mui/material"
import GameCard from "./GameCard"
import GameCardBack from "./GameCardBack"

export function GameDraftingPhase({ match, you, onPick }) {
	const { pool, turn, hands, picksRemaining } = match.state
	const isYourTurn = turn === you

	return (
		<Box>
			<Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
				{isYourTurn ? "Your turn to pick" : "Waiting for opponent's pick..."}
				<br />
				{picksRemaining[you]} remaining
			</Typography>

			<Box
				sx={{
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "center",
					gap: 1.5,
					maxWidth: 630,
					mx: "auto",
					mb: 4,
				}}
			>
				{pool.map((slot) =>
					slot.claimedBy === you ? (
						<GameCard key={slot.slotId} card={slot.card} disabled />
					) : (
						<GameCardBack
							key={slot.slotId}
							disabled={!isYourTurn || Boolean(slot.claimedBy)}
							label={slot.claimedBy ? "Taken" : undefined}
							onClick={() => onPick(slot.slotId)}
						/>
					)
				)}
			</Box>

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
