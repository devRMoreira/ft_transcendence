"use client"

import LoadingButton from "@/components/LoadingButton"
import { Alert, Box, Container, FormControl, FormLabel, Link, Paper, Stack, TextField, Typography } from "@mui/material"
import { useState } from "react"
import NextLink from "next/link";
import { signupSubmit } from "../../services/signup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export default function SignupPage()
{
	const router = useRouter()

	const [form, setForm] = useState({name: "", email: "", password: "", cpassword: ""})
	const [error, setError] = useState({name: "", email: "", password: "", cpassword: "", page:""})

	const [loading, setLoading] = useState(false)

	const handleOnChange = (e) => {
		const {name, value} = e.target

		setForm(prev => ({...prev, [name]: value}))
		setError(prev => ({...prev, [name]: ""}))
	}

	const addError = (field, msg) => {setError(prev => ({...prev, [field]: msg}))}

	const validateInputs = ({name, email, password, cpassword}) =>
	{
		let isValid = true

		if(!name || name.length > 32)
		{
			addError("name", "Please enter a valid name. Maximum 32 characters.")
			isValid = false
		}

		if(!email || !EMAIL_REGEX.test(email))
		{
			addError("email", "Please enter a valid email address.")
			isValid = false
		}

		if(!password || password.length < 15)
		{
			addError("password", "Please enter a valid password.")
			isValid = false
		}

		if(password != cpassword)
		{
			addError("cpassword", "Passwords don't match")
			isValid = false
		}

		return isValid
	}

	async function handleSubmit(e)
	{
		e.preventDefault()

		setError({name: "", email: "", password: "", cpassword: "", page:""})

		const data = {
			name: form.name.trim(),
			email: form.email.trim(),
			password: form.password.trim(),
			cpassword: form.cpassword.trim(),
		}

		if(!validateInputs(data))
			return

		setLoading(true)

		const res = await signupSubmit(data)

		if(!res.ok)
		{
			setLoading(false)
			addError("page", res.error || "Something went wrong")
			return
		}

		const email = data.email
		const password = data.password

		const signStatus = await signIn("credentials", {email, password, redirect:false})

		setLoading(false)

		if(signStatus?.error)
		{
			router.push("/login")
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
						Registration
					</Typography>

					{error.page && <Alert severity="error">{error.page}</Alert>}

					<FormControl spacing={1}>
						<FormLabel htmlFor="name">Display name</FormLabel>

						<TextField name="name" type="name"
						placeholder="John Doe"
						error={error.name} helperText={error.name ? error.name : "Enter a unique username"}
						color={error.name ? 'error' : 'primary'}
						onChange={handleOnChange}
						required fullWidth/>
					</FormControl>

					<FormControl spacing={1}>
						<FormLabel htmlFor="email">Email</FormLabel>

						<TextField name="email" type="email"
						placeholder="your@email.com" autoComplete="email"
						error={error.email} helperText={error.email}
						color={error.email ? 'error' : 'primary'}
						onChange={handleOnChange}
						required fullWidth/>
					</FormControl>

					<FormControl spacing={1}>
						<FormLabel htmlFor="password">Password</FormLabel>

						<TextField name="password" type="password"
						placeholder="••••••"
						error={error.password} helperText={error.password ? error.password : "Must be at least 15 characters long."}
						color={error.password ? 'error' : 'primary'}
						onChange={handleOnChange}
						required fullWidth/>

					</FormControl>

					<FormControl spacing={1}>
						<FormLabel htmlFor="cpassword">Password Confirmation</FormLabel>

						<TextField name="cpassword" type="password"
						placeholder="••••••"
						error={error.cpassword} helperText={error.cpassword}
						color={error.cpassword ? 'error' : 'primary'}
						onChange={handleOnChange}
						required fullWidth/>
					</FormControl>

					<LoadingButton type="submit" loading={loading}
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