"use client"

import { useState } from "react"
import { Box, Tabs, Tab, Typography } from "@mui/material"
import { fakeStates } from "./fakeStates"
import { GameChoosingPhase } from "@/components/GameChoosingPhase"
import { GameDraftingPhase } from "@/components/GameDraftingPhase"
import { GamePlayingPhase } from "@/components/GamePlayingPhase"
import { GameCompletePhase } from "@/components/GameCompletePhase"

const choicePrint =
	(label) =>
	(...args) =>
		console.log(`${label} called with`, ...args)

const scenarios = Object.keys(fakeStates)

export default function MatchPreviewPage() {
	const [selected, setSelected] = useState(scenarios[0])
	const match = fakeStates[selected]

	return (
		<Box sx={{ maxWidth: 900, mx: "auto", mt: 4, p: 2 }}>
			<Typography variant="h5" gutterBottom>
				Test page
			</Typography>

			<Tabs
				value={selected}
				onChange={(e, v) => setSelected(v)}
				variant="scrollable"
				scrollButtons="auto"
				sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
			>
				{scenarios.map((key) => (
					<Tab key={key} value={key} label={key} />
				))}
			</Tabs>

			<Box sx={{ border: "1px dashed", borderColor: "divider", p: 3, borderRadius: 1 }}>
				{match.status === "CHOOSING" && (
					<GameChoosingPhase
						match={match}
						you={match.you}
						onChoose={choicePrint("onChoose")}
					/>
				)}
				{match.status === "DRAFTING" && (
					<GameDraftingPhase match={match} you={match.you} onPick={choicePrint("onPick")} />
				)}
				{match.status === "PLAYING" && (
					<GamePlayingPhase match={match} you={match.you} onPlay={choicePrint("onPlay")} />
				)}
				{match.status === "COMPLETE" && <GameCompletePhase match={match} you={match.you} />}
			</Box>
		</Box>
	)
}
