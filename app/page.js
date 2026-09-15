import { auth } from "@/auth";
import SignOutButton from "@/components/SignOutButton";
import { Button, Stack } from "@mui/material";

export default async function HomePage() {
	const session = await auth();
	const userName = session?.user?.name || "user";

	return (
		<Stack spacing={2} sx={{ p: 4 }}>
			<h1>Home Page</h1>
			Logged as: {userName}
			<Button href="/groups" variant="contained">
				Groups
			</Button>
			<SignOutButton />
		</Stack>
	);
}
