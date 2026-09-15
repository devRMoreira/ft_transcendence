"use client";

import { Alert, Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateGroupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const response = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    const data = await response.json();
    setSaving(false);

    if (!response.ok) {
      setError(data.error || "Unable to create group");
      return;
    }
    router.push(`/groups/${data.group.id}`);
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Stack component="form" spacing={3} onSubmit={handleSubmit}>
        <Typography component="h1" variant="h4">Create group</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} inputprops={{ maxLength: 15 }} required />
        <TextField label="Description" value={description} onChange={(event) => setDescription(event.target.value)} inputProps={{ maxLength: 300 }} multiline minRows={4} />
        <Button type="submit" variant="contained" disabled={saving}>{saving ? "Creating..." : "Create group"}</Button>
        <Button component="a" href="/groups" variant="text">Cancel</Button>
      </Stack>
    </Container>
  );
}