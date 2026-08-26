"use client"

import LoadingButton from "@/components/LoadingButton"
import { Alert, Box, Container, FormLabel, Link, Paper, Stack, TextField, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { useState } from "react"
import NextLink from "next/link";
import { signIn } from "next-auth/react"


export default function SignInPage()
{
	const router = useRouter()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	async function handleSubmit(e)
	{
		e.preventDefault()
		setError("")
		setLoading(true)

		const res = await signIn("credentials", {
				email,
				password,
				redirect: false,
			})

		setLoading(false);

		if(res?.error)
		{
			setError("Invalid email or password")
			return
		}

		router.push("/")
		router.refresh()
	}

	return (
	<Container maxWidth="xs">
		<Box sx={{
			minHeight: "100dvh",
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		}}>
			<Paper sx={{ p: 4, width: "100%" }}>
				<Stack spacing={3} component="form" onSubmit={handleSubmit}>
					<Typography component="h1" variant="h4">
						Sign in
					</Typography>

					{error && <Alert severity="error">{error}</Alert>}
					<Stack spacing={1}>
						<FormLabel>Email</FormLabel>
						<TextField placeholder="your@email.com" type="email" value={email}
						onChange={(e) => setEmail(e.target.value)}
						required fullWidth autoComplete="email"/>
					</Stack>

					<Stack spacing={1}>
						<FormLabel>Password</FormLabel>
						<TextField placeholder="••••••" type="password" value={password}
						onChange={(e) => setPassword(e.target.value)}
						required fullWidth autoComplete="current-password"/>
					</Stack>

					<LoadingButton type="submit" loading={loading}
					variant="contained" size="large" fullWidth>
						Sign in
					</LoadingButton>

					<Typography align="center">
						Don't have an account? {" "}
						<Link component={NextLink} href="/signup">
							Register
						</Link>
					</Typography>
				</Stack>
			</Paper>
		</Box>
	</Container>
	)

}