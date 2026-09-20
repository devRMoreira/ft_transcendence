import { auth } from "@/auth";
import SignOutButton from "@/components/SignOutButton";
import GroupInvitations from "@/components/GroupInvitations";
import { Button, Stack } from "@mui/material";

export default async function HomePage() {
	const session = await auth();
	const userName = session?.user?.name || "user";

	return (
		<Stack spacing={2} sx={{ p: 4 }}>
			<h1>Home Page</h1>
			Logged as: {userName}
			<GroupInvitations />
			<Button href="/play" variant="contained">
				Play
			</Button>
			<Button href="/friends" variant="contained">
				Friends
			</Button>
			<Button href="/groups" variant="contained">
				Groups
			</Button>
			<SignOutButton />
		</Stack>
	);
}
