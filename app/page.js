import { auth } from "@/auth";
import SignOutButton from "@/components/SignOutButton";
import { Button, Stack } from "@mui/material";

export default async function HomePage() {
	const session = await auth();
	const userName = session?.user?.name || "user";

	return (
		<Stack spacing={2} sx={{ p: 4 }}>
			Hey {userName}
			<Button href="/groups" variant="contained">
				Groups
			</Button>
			<SignOutButton />
			Home Page
		</Stack>
	);
}
