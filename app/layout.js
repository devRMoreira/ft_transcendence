import AppThemeProvider from "./theme-provider"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth"
import { Navbar } from "@/components/NavBar"

export const metadata = {
	title: "CardGame",
	description: "CardGame Description",
}

export default async function RootLayout({ children }) {
	const session = await auth()

	return (
		<html lang="en">
			<body>
				<SessionProvider session={session}>
					<AppRouterCacheProvider>
						<AppThemeProvider>
							<Navbar/>
							{children}
						</AppThemeProvider>
					</AppRouterCacheProvider>
				</SessionProvider>
			</body>
		</html>
	)
}
