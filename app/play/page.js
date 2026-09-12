"use client"

import LoadingButton from "@/components/LoadingButton"
import { newMatchSubmit } from "@/services/api"

import { Alert, Box, FormControl, Stack, TextField, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function PlayPage() {
	const router = useRouter()
	const [opponentName, setOpponentName] = useState("")
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)

	const handleCreate = async (e) => {
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

	return (
		<Box sx={{ maxWidth: "400px", mx: "auto", mt: 8, textAlign: "center" }}>
			<Typography variant="h5">Start a match</Typography>

			<Typography sx={{ mb: 2 }}>Enter the opponent's display name.</Typography>

			<Stack component="form" spacing={2} onSubmit={handleCreate}>
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
			</Stack>
		</Box>
	)
}
