import SignOutButton from "@/components/SignOutButton";
import Link from "next/link";
import { Button, Stack } from "@mui/material";

export default function HomePage() {
	return (
		<Stack spacing={2} sx={{ p: 4 }}>
			<Button component={Link} href="/groups" variant="contained">
				Groups
			</Button>
			<SignOutButton />
			Landing
		</Stack>
	);
}
