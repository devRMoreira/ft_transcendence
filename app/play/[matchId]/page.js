"use client"

import { GameChoosingPhase } from "@/components/GameChoosingPhase"
import { GameCompletePhase } from "@/components/GameCompletePhase"
import { GameDraftingPhase } from "@/components/GameDraftingPhase"
import { GamePlayingPhase } from "@/components/GamePlayingPhase"
import { fetchMatchData, submitMatchAction, fetchRoundResolution, fetchRoll } from "@/services/api"
import { Alert, Box, CircularProgress } from "@mui/material"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

const POLL_INTERVAL = 1500
const RESOLVE_DELAY = 2000

export default function MatchPage() {
	const { matchId } = useParams()
	const [match, setMatch] = useState(null)
	const [error, setError] = useState("")
	const resolvingRef = useRef(null)
	const rollingRef = useRef(false)

	const getMatchData = useCallback(async () => {
		try {
			const data = await fetchMatchData(matchId)
			setError("")
			setMatch(data)
		} catch (error) {
			setError(error.message)
		}
	}, [matchId])

	useEffect(() => {
		getMatchData()
		const interval = setInterval(getMatchData, POLL_INTERVAL)
		return () => clearInterval(interval)
	}, [getMatchData])

	//Rolling
	useEffect(() => {
		if (
			match?.status === "PLAYING" &&
			match.state.status === "rolling" &&
			!rollingRef.current
		) {
			const roll = async () => {
				try {
					rollingRef.current = true
					const data = await fetchRoll(matchId)
					setMatch(data)
				} catch (error) {
				} finally {
					rollingRef.current = false
				}
			}
			roll()
		}
	}, [match, matchId])

	//Round resolution
	useEffect(() => {
		if (
			match?.status === "PLAYING" &&
			match.state.status === "readyToResolve" &&
			resolvingRef.current === null
		) {
			resolvingRef.current = setTimeout(async () => {
				try {
					const data = await fetchRoundResolution(matchId)

					setMatch(data)
				} catch (error) {
				} finally {
					resolvingRef.current = null
				}
			}, RESOLVE_DELAY)
		}
	}, [match, matchId])

	//clear the timers if page is changed
	useEffect(() => {
		return () => {
			if (resolvingRef.current) clearTimeout(resolvingRef.current)
		}
	}, [])

	async function handleAction(action, body) {
		try {
			const data = await submitMatchAction(matchId, action, body)
			setError("")
			setMatch(data)
		} catch (error) {
			setError(error.message)
		}
	}

	if (!match) {
		return (
			<Box sx={{ textAlign: "center", mt: 8 }}>
				<CircularProgress />
			</Box>
		)
	}

	const you = match.you

	return (
		<Box sx={{ maxWidth: 720, mx: "auto", mt: 4, p: 2 }}>
			{error && <Alert severity="error">{error}</Alert>}

			{match.status === "CHOOSING" && (
				<GameChoosingPhase
					match={match}
					you={you}
					onChoose={(choice) => handleAction("choose", { choice })}
				/>
			)}

			{match.status === "DRAFTING" && (
				<GameDraftingPhase
					match={match}
					you={you}
					onPick={(slotId) => handleAction("draft", { slotId })}
				/>
			)}

			{match.status === "PLAYING" && (
				<GamePlayingPhase
					match={match}
					you={you}
					onPlay={(instanceId) => handleAction("play", { instanceId })}
				/>
			)}

			{match.status === "COMPLETE" && <GameCompletePhase match={match} you={you} />}
		</Box>
	)
}
