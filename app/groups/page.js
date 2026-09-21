"use client";

import Link from "next/link";
import { Alert, Button, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import GroupInvitations from "@/components/GroupInvitations";

export default function GroupsPage() {
  const [state, setState] = useState({ loading: true, group: null, error: "" });

  useEffect(() => {
    fetch("/api/groups")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load group");
        setState({ loading: false, group: data.group, error: "" });
      })
      .catch((error) => setState({ loading: false, group: null, error: error.message }));
  }, []);

  if (state.loading) return <CircularProgress sx={{ m: 4 }} />;

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Typography component="h1" variant="h4">Groups</Typography>
        <GroupInvitations />
        {state.error && <Alert severity="error">{state.error}</Alert>}
        {!state.error && state.group && (
          <Stack spacing={2}>
            <Typography variant="h5">{state.group.name}</Typography>
            <Typography>{state.group.description || "No description"}</Typography>
            <Button component={Link} href={`/groups/${state.group.id}`} variant="contained">
              Open group
            </Button>
          </Stack>
        )}
        {!state.error && !state.group && (
          <Stack spacing={2}>
            <Typography>You do not belong to a group yet.</Typography>
            <Button component={Link} href="/group/create" variant="contained">
              Create group
            </Button>
          </Stack>
        )}
        <Button component={Link} href="/" variant="text">Back home</Button>
      </Stack>
    </Container>
  );
}