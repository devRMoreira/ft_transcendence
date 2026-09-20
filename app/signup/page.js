"use client"

import LoadingButton from "@/components/LoadingButton"
import { Alert, Box, Checkbox, Container, FormControl, FormControlLabel, FormLabel, Link, Paper, Stack, TextField, Typography } from "@mui/material"
import { useState } from "react"
import NextLink from "next/link";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signupSubmit } from "@/services/api";

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export default function SignupPage()
{
	const router = useRouter()

	const [form, setForm] = useState({name: "", email: "", password: "", cpassword: "", acceptedTerms: false})
	const [error, setError] = useState({name: "", email: "", password: "", cpassword: "", acceptedTerms: "", page:""})

	const [loading, setLoading] = useState(false)

	const handleOnChange = (e) => {
		const {name, value} = e.target

		setForm(prev => ({...prev, [name]: value}))
		setError(prev => ({...prev, [name]: ""}))
	}

	const addError = (field, msg) => {setError(prev => ({...prev, [field]: msg}))}

	const validateInputs = ({name, email, password, cpassword, acceptedTerms}) =>
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

		if(!acceptedTerms)
		{
			addError("acceptedTerms", "You must accept the Terms of Service and Privacy Policy.")
			isValid = false
		}

		return isValid
	}

	const handleSubmit = async (e) =>
	{
		e.preventDefault()

		setError({name: "", email: "", password: "", cpassword: "", acceptedTerms: "", page:""})

		const data = {
			name: form.name.trim(),
			email: form.email.trim(),
			password: form.password.trim(),
			cpassword: form.cpassword.trim(),
			acceptedTerms: form.acceptedTerms,
		}

		if(!validateInputs(data))
			return

		setLoading(true)

		try
		{
			await signupSubmit(data)

			const email = data.email
			const password = data.password
			const signStatus = await signIn("credentials", {email, password, redirect:false})

			if(signStatus?.error)
			{
				router.push("/login")
				return
			}

			router.push("/")
			router.refresh()
		}
		catch(error)
		{
			addError("page", error.message)
		}
		finally
		{
			setLoading(false)
		}
	}

  return (
	<Container maxWidth="xs">
		<Box sx={{
			minHeight: "80dvh",
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

					<FormControl error={Boolean(error.acceptedTerms)}>
						<FormControlLabel
							control={
								<Checkbox
									checked={form.acceptedTerms}
									onChange={(e) => {
										setForm(prev => ({...prev, acceptedTerms: e.target.checked}))
										setError(prev => ({...prev, acceptedTerms: ""}))
									}}
								/>
							}
							label={
								<Typography variant="body2">
									I agree to the <Link href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</Link> and <Link href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>.
								</Typography>
							}
						/>
						{error.acceptedTerms && <Typography variant="caption" color="error">{error.acceptedTerms}</Typography>}
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