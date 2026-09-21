import { Box, Container, Link, Stack, Typography } from "@mui/material"

export function Footer() {
	return (
		<Box component="footer" sx={{ bgcolor: "background.paper", color: "text.primary", borderTop: 1, borderColor: "divider", boxShadow: 1, py: 2 }}>
			<Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center" }}>
				<Stack
					direction={{ xs: "column", sm: "row" }}
					spacing={2}
					sx={{ alignItems: "center", justifyContent: "center", width: "100%" }}
				>
					<Typography variant="body2" sx={{ color: "inherit", fontWeight: "bold" }}>
						CardGame
					</Typography>
					<Stack direction="row" spacing={2}>
						<Link href="/privacy" underline="none" sx={{ color: "text.primary", fontSize: "1rem", "&:hover": { color: "primary.main" } }}>
							Privacy Policy
						</Link>
						<Link href="/terms" underline="none" sx={{ color: "text.primary", fontSize: "1rem", "&:hover": { color: "primary.main" } }}>
							Terms of Service
						</Link>
					</Stack>
				</Stack>
			</Container>
		</Box>
	)
}
