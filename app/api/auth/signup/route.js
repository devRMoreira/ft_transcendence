import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export async function POST(request)
{
	let body
	try {
	body = await request.json()

	} catch {

		return Response.json(
			{error: "Invalid request body"},
			{status: 400}
		)
	}

	const {password, name, acceptedTerms} = body
	const email = body.email?.trim().toLowerCase()

	if (!email || !password || !name || acceptedTerms !== true)
		return Response.json(
			{ error: "You must accept the Terms of Service and Privacy Policy" },
			{ status: 400 })

	if(!EMAIL_REGEX.test(email))
		return Response.json(
			{ error: "Invalid email"},
			{ status : 400})

	if(password.length < 15)
		return Response.json(
			{ error: "Password doesn't meet criteria"},
			{ status : 400})

	if(name.length > 32)
		return Response.json(
			{ error: "Name is too long"},
			{ status : 400})

	const existingName = await prisma.user.findUnique({ where: { name } })
	if (existingName) {
		return Response.json(
			{ error: "An account with this name already exists" },
			{ status: 409 }
		)
	}

	const existingEmail = await prisma.user.findUnique({ where: { email } })
	if (existingEmail) {
		return Response.json(
			{ error: "An account with this email already exists" },
			{ status: 409 }
		)
	}

	const passwordHash = await bcrypt.hash(password, 10)

	//double submit concurrency edge case
	try{
		const user = await prisma.user.create({
			data: { email, passwordHash, name },
		})
		return Response.json({ id: user.id, email: user.email, name: user.name })

	} catch(error) {
	if(error.code === "P2002"){
		return Response.json(
		{error: "An account with this email or name already exists"},
		{status: 409}
		)
	}
		throw error
	}

}