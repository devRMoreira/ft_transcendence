"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
// prettier-ignore
import { AppBar, Box, Button, IconButton, Toolbar, Typography, Tooltip, CircularProgress} from "@mui/material"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import ChatIcon from "@mui/icons-material/Chat"
import PeopleIcon from "@mui/icons-material/People"
import SignOutButton from "@/components/SignOutButton"

export function Navbar() {
	const pathname = usePathname()
	const { data: session, status } = useSession()

	const isActive = (path) => pathname?.startsWith(path)

	return (
		<AppBar position="sticky" sx={navStyles.appBar}>
			<Toolbar sx={navStyles.toolbar}>
				<Box sx={navStyles.section}>
					<Typography variant="h6" component={Link} href="/" sx={navStyles.logo}>
						CardGame
					</Typography>
					{session && (
						<>
							<Button
								component={Link}
								href="/play"
								sx={navStyles.linkButton(isActive("/play"))}
							>
								Play
							</Button>
							<Button
								component={Link}
								href="/search"
								sx={navStyles.linkButton(isActive("/search"))}
							>
								Search
							</Button>
							<Button
								component={Link}
								href="/groups"
								sx={navStyles.linkButton(isActive("/groups"))}
							>
								Groups
							</Button>
                            <Button
								component={Link}
								href="/leaderboard"
								sx={navStyles.linkButton(isActive("/play"))}
							>
								Leaderboard
							</Button>
						</>
					)}
				</Box>

				<Box sx={navStyles.section}>
					{session && (
						<>
							<Tooltip title="Friends">
								<IconButton
									component={Link}
									href="/friends"
									sx={navStyles.iconButton(isActive("/friends"))}
								>
									<PeopleIcon />
								</IconButton>
							</Tooltip>

							<Tooltip title="Messages">
								<IconButton
									component={Link}
									href="/messages"
									sx={navStyles.iconButton(isActive("/messages"))}
								>
									<ChatIcon />
								</IconButton>
							</Tooltip>

							<Tooltip title="Profile">
								<IconButton
									component={Link}
									href="/profile"
									sx={navStyles.iconButton(isActive("/profile"))}
								>
									<AccountCircleIcon />
								</IconButton>
							</Tooltip>
						</>
					)}

					{status === "loading" ? (
						<CircularProgress size={24} sx={{ ml: 2 }} />
					) : session ? (
						<Box sx={{ ml: 2 }}>
							<SignOutButton />
						</Box>
					) : null}
				</Box>
			</Toolbar>
		</AppBar>
	)
}

const navStyles = {
	appBar: {
		bgcolor: "background.paper",
		color: "text.primary",
		boxShadow: 1,
	},
	toolbar: {
		display: "flex",
		justifyContent: "space-between",
	},
	section: {
		display: "flex",
		alignItems: "center",
		gap: 2,
	},
	logo: {
		fontWeight: "bold",
		textDecoration: "none",
		color: "inherit",
		mr: 2,
	},
	linkButton: (isActive) => ({
		color: isActive ? "primary.main" : "text.primary",
		fontWeight: isActive ? "bold" : "normal",
		textTransform: "none",
		fontSize: "1rem",
	}),
	iconButton: (isActive) => ({
		color: isActive ? "primary.main" : "text.secondary",
	}),
}
