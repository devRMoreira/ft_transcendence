export async function signupSubmit(name, email, pw)
{
	const res = await fetch("/api/auth/signup", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	})

	const data = await res.json()

	if(!res.ok)
	{
		return data.error ? data.error : "Something went wrong."
	}
}

