import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import GitHub from "next-auth/providers/github"

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma), // will be necessary for OAuth
	session: { strategy: "jwt" },
	pages: {
		signIn: "/signin",
	},
	providers: [
		GitHub,
		Credentials({
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},

			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null

				const user = await prisma.user.findUnique({
					where: { email: credentials.email.trim().toLowerCase() },
				})

				if (!user || !user.passwordHash) return null

				const isValid = await bcrypt.compare(credentials.password, user.passwordHash)

				if (!isValid) return null

				return { id: user.id, name: user.name, email: user.email, image: user.image }
			},
		}),
		// oauth https://authjs.dev/getting-started/providers/google
	],

	callbacks: {
		async jwt({ token, user }) {
			if (user) token.id = user.id
			return token
		},
		async session({ session, token }) {
			if (session.user) session.user.id = token.id
			return session
		},
	},
})
