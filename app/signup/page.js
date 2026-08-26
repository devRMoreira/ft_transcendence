"use client"

import LoadingButton from "@/components/LoadingButton"
import { Alert, Box, Container, FormControl, FormLabel, Link, Paper, Stack, TextField, Typography } from "@mui/material"
import { useState } from "react"
import NextLink from "next/link";
import { signupSubmit } from "../../services/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";


//one upper case letter, one lower case letter,one number, and one special character
const PASS_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export default function SignupPage()
{
	const router = useRouter()
	const [nameError, setNameError] = useState({state: false, msg: ""})
	const [emailError, setEmailError] = useState({state: false, msg: ""})
	const [passwordError, setPasswordError] = useState({state: false, msg: ""})
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)

	const validateInputs = () =>
	{
		const name = document.getElementById('name')
		const email = document.getElementById('email')
		const password = document.getElementById('password')

		let isValid = true

		if(!name.value || name.value.length > 32)
		{
			setNameError({state: true, msg: "Please enter a valid name. Maximum 32 characters."})
			isValid = false
		}
		else
			setNameError({state: false, msg: ""})

		if(!email.value || !EMAIL_REGEX.test(email.value))
		{
			setEmailError({state: true, msg: "Please enter a valid email address."})
			isValid = false
		}
		else
			setEmailError({state: false, msg: ""})

		if(!password.value || !PASS_REGEX.test(password.value))
		{
			setPasswordError({state: true, msg: "Please enter a valid password."})
			isValid = false
		}
		else
			setPasswordError({state: false, msg: ""})



		return isValid
	}

	async function handleSubmit(e)
	{
		e.preventDefault()
		setError("")

		setLoading(true)

		// const res = await signupSubmit(, email, password)


		setLoading(false)

		if(res)
		{
			setError(res)
			return
		}

		await signIn("credentials", {email, password, redirect:false});
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
						Registration
					</Typography>

					{error && <Alert severity="error">{error}</Alert>}

					<FormControl spacing={1}>
						<FormLabel htmlFor="name">Display name</FormLabel>

						<TextField placeholder="John Doe" type="name" id="name"
						error={nameError.state} helperText={nameError.msg}
						color={nameError.state ? 'error' : 'primary'}
						required fullWidth/>
					</FormControl>

					<FormControl spacing={1}>
						<FormLabel htmlFor="email">Email</FormLabel>

						<TextField placeholder="your@email.com" type="email" id="email"
						error={emailError.state} helperText={emailError.msg}
						color={emailError.state ? 'error' : 'primary'}
						required fullWidth autoComplete="email"/>
					</FormControl>

					<FormControl spacing={1}>
						<FormLabel htmlFor="password">Password</FormLabel>

						<TextField placeholder="••••••" type="password" id="password"
						error={passwordError.state} helperText={passwordError.msg}
						color={passwordError.state ? 'error' : 'primary'}
						required fullWidth/>
					</FormControl>

					<LoadingButton type="submit" loading={loading} onClick={validateInputs}
					variant="contained" fullWidth>

						Register
					</LoadingButton>

					<Typography align="center">
						Already have an account? {" "}
						<Link component={NextLink} href="/signin">
							Sign in
						</Link>
					</Typography>
				</Stack>
			</Paper>
		</Box>
	</Container>
  )

}