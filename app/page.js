"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
// prettier-ignore
import { Box, Button, Card, CardContent, Container, Grid, Typography, CircularProgress } from "@mui/material"
import SportsEsportsIcon from "@mui/icons-material/SportsEsports"
import GroupsIcon from "@mui/icons-material/Groups"
import PersonIcon from "@mui/icons-material/Person"

export default function HomePage() {
	const { data: session, status } = useSession()

	if (status === "loading") {
		return (
			<Box sx={{ textAlign: "center", mt: 10 }}>
				<CircularProgress />
			</Box>
		)
	}

	return (
		<Container maxWidth="md" sx={{ mt: 6 }}>
			<Box sx={{ mb: 4 }}>
				<Typography variant="h4" fontWeight="bold" gutterBottom>
					Welcome back, {session.user?.name || "Player"}!
				</Typography>
				<Typography color="text.secondary">Ready for your next match?</Typography>
			</Box>

			<Grid container spacing={3}>
				<Grid xs={12} sm={4}>
					<Card sx={{ textAlign: "center", p: 2 }}>
						<CardContent>
							<SportsEsportsIcon
								sx={{ fontSize: 48, color: "primary.main", mb: 1 }}
							/>
							<Typography variant="h6" gutterBottom>
								Play Game
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
								Start an AI or PvP match.
							</Typography>
							<Button component={Link} href="/play" variant="contained" fullWidth>
								Jump In
							</Button>
						</CardContent>
					</Card>
				</Grid>

				<Grid xs={12} sm={4}>
					<Card sx={{ textAlign: "center", p: 2 }}>
						<CardContent>
							<GroupsIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
							<Typography variant="h6" gutterBottom>
								Groups
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
								Join or manage player groups.
							</Typography>
							<Button component={Link} href="/groups" variant="outlined" fullWidth>
								View Groups
							</Button>
						</CardContent>
					</Card>
				</Grid>

				<Grid xs={12} sm={4}>
					<Card sx={{ textAlign: "center", p: 2 }}>
						<CardContent>
							<PersonIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
							<Typography variant="h6" gutterBottom>
								Profile
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
								Check your match history.
							</Typography>
							<Button component={Link} href="/profile" variant="outlined" fullWidth>
								My Profile
							</Button>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Container>
	)
}
