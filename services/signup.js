export async function signupSubmit(formData)
{
	const res = await fetch("/api/auth/signup", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(formData)
	})

	return res
}

