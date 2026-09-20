import AppThemeProvider from "./theme-provider"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth"
import { Navbar } from "@/components/NavBar"
import { Footer } from "@/components/Footer"
import { Box } from "@mui/material"

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
							<Box
								sx={{
									minHeight: "100vh",
									display: "flex",
									flexDirection: "column",
								}}
							>
								<Navbar />
								<Box component="main" sx={{ flexGrow: 1 }}>
									{children}
								</Box>
								<Footer />
							</Box>
						</AppThemeProvider>
					</AppRouterCacheProvider>
				</SessionProvider>
			</body>
		</html>
	)
}
