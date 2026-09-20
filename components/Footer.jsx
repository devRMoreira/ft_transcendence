import { Box, Container, Stack, Typography } from "@mui/material"
import Link from "next/link"

export function Footer() {
	return (
		<Box component="footer" sx={{ borderTop: 1, borderColor: "divider", py: 3 }}>
			<Container maxWidth="lg">
				<Stack
					direction={{ xs: "column", sm: "row" }}
					spacing={2}
					alignitems={{ xs: "flex-start", sm: "center" }}
					justifycontent="space-between"
				>
					<Typography variant="body2" color="text.secondary">
						CardGame
					</Typography>
					<Stack direction="row" spacing={2}>
						<Link href="/privacy" color="text.secondary" variant="body2">
							Privacy Policy
						</Link>
						<Link href="/terms" color="text.secondary" variant="body2">
							Terms of Service
						</Link>
					</Stack>
				</Stack>
			</Container>
		</Box>
	)
}
