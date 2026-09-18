"use client"

import LoadingButton from "@/components/LoadingButton"
import { newMatchSubmit, newAIMatchSubmit, fetchActiveMatch } from "@/services/api"
// prettier-ignore
import { Alert, Box, Button, CircularProgress, FormControl, Stack, TextField, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

export default function PlayPage() {
	const router = useRouter()
	const [mode, setMode] = useState("select")
	const [opponentName, setOpponentName] = useState("")
	const [error, setError] = useState("")
	const [activeMatch, setActiveMatch] = useState(null)
	const [loadingActive, setLoadingActive] = useState(true)
	const [loading, setLoading] = useState(false)

	const handleActiveMatch = useCallback(async () => {
		try {
			const data = await fetchActiveMatch()
			setActiveMatch(data.active ? data.match : null)
		} catch (e) {
			setActiveMatch(null)
		} finally {
			setLoadingActive(false)
		}
	}, [])

	useEffect(() => {
		handleActiveMatch()

		const interval = setInterval(handleActiveMatch, 2000)

		return () => clearInterval(interval)
	}, [handleActiveMatch])

	const handleRealMatch = async (e) => {
		e.preventDefault()
		setError("")
		setLoading(true)

		try {
			const data = await newMatchSubmit(opponentName)
			router.push(`/play/${data.id}`)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	const handleAIMatch = async () => {
		setError("")
		setLoading(true)

		try {
			const data = await newAIMatchSubmit()
			router.push(`/play/${data.id}`)
		} catch (error) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	if (loadingActive) {
		return (
			<Box sx={{ textAlign: "center", mt: 8 }}>
				<CircularProgress />
			</Box>
		)
	}

	if (activeMatch) {
		return (
			<Box sx={{ maxWidth: "400px", mx: "auto", mt: 8, textAlign: "center" }}>
				<Typography variant="h5" sx={{ mb: 2 }}>
					You have a match in progress
				</Typography>
				<Button
					variant="contained"
					size="large"
					onClick={() => router.push(`/play/${activeMatch.id}`)}
				>
					Resume match
				</Button>
			</Box>
		)
	}

	if (mode === "select") {
		return (
			<Box sx={{ maxWidth: "400px", mx: "auto", mt: 8, textAlign: "center" }}>
				<Typography variant="h5" sx={{ mb: 3 }}>
					Start a match
				</Typography>

				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				<Stack spacing={2}>
					<Button variant="contained" size="large" onClick={() => setMode("person")}>
						Play against a person
					</Button>

					<LoadingButton
						variant="outlined"
						size="large"
						loading={loading}
						onClick={handleAIMatch}
					>
						Play against AI
					</LoadingButton>
				</Stack>
			</Box>
		)
	}

	return (
		<Box sx={{ maxWidth: "400px", mx: "auto", mt: 8, textAlign: "center" }}>
			<Typography variant="h5">Start a match</Typography>

			<Typography sx={{ mb: 2 }}>Enter the opponent's display name.</Typography>

			<Stack component="form" spacing={2} onSubmit={handleRealMatch}>
				{error && <Alert severity="error">{error}</Alert>}

				<FormControl>
					<TextField
						type="name"
						placeholder="John Doe"
						onChange={(e) => setOpponentName(e.target.value)}
						required
					/>
				</FormControl>

				<LoadingButton type="submit" variant="contained" loading={loading} fullWidth>
					Create match
				</LoadingButton>

				<Button onClick={() => setMode("select")}>Back</Button>
			</Stack>
		</Box>
	)
}
