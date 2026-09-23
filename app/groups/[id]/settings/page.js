"use client";

import { Alert, Button, Container, List, ListItem, ListItemText, Stack, TextField, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GroupSettingsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [group, setGroup] = useState(null);
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function load() {
    const groupResponse = await fetch(`/api/groups/${id}`);
    const groupData = await groupResponse.json();
    if (!groupResponse.ok || groupData.role !== "ADMIN") throw new Error("Only admins can access settings");
    setGroup(groupData.group);
    setDescription(groupData.group.description || "");
  }

  useEffect(() => {
    fetch(`/api/groups/${id}`)
      .then(async (response) => {
        const groupData = await response.json();
        if (!response.ok || groupData.role !== "ADMIN") throw new Error("Only admins can access settings");
        setGroup(groupData.group);
        setDescription(groupData.group.description || "");
      })
      .catch((loadError) => setError(loadError.message));
  }, [id]);

  async function updateDescription(event) {
    event.preventDefault();
    const response = await fetch(`/api/groups/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });
    if (!response.ok) setError((await response.json()).error || "Unable to update group");
  }

  async function inviteMember(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const response = await fetch(`/api/groups/${id}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) setError((await response.json()).error || "Unable to invite member");
    else {
      setUserId("");
      setSuccess("Invitation sent successfully.");
    }
  }

  async function removeMember(memberId) {
    const response = await fetch(`/api/groups/${id}/members/${memberId}`, { method: "DELETE" });
    if (!response.ok) setError((await response.json()).error || "Unable to remove member");
    else load().catch((loadError) => setError(loadError.message));
  }

  async function deleteGroup() {
    if (!window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) return;

    const response = await fetch(`/api/groups/${id}`, { method: "DELETE" });
    if (!response.ok) setError((await response.json()).error || "Unable to delete group");
    else router.push("/groups");
  }

  if (error && !group) return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
  if (!group) return null;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Stack spacing={3}>
        <Typography component="h1" variant="h4">Group settings</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Stack component="form" spacing={2} onSubmit={updateDescription}>
          <TextField label="Description" value={description} onChange={(event) => setDescription(event.target.value)} inputprops={{ maxLength: 300 }} multiline minRows={3} />
          <Button type="submit" variant="contained">Save description</Button>
        </Stack>
        <Stack component="form" spacing={2} onSubmit={inviteMember}>
          <Typography variant="h6">Invite a player</Typography>
          {success && <Alert severity="success">{success}</Alert>}
          <TextField label="Player ID, name, or email" value={userId} onChange={(event) => setUserId(event.target.value)} required />
          <Button type="submit" variant="outlined">Send invitation</Button>
        </Stack>
        <Typography variant="h6">Members</Typography>
        <List>{group.members.map((member) => <ListItem key={member.id} secondaryAction={member.role !== "ADMIN" && <Button color="error" onClick={() => removeMember(member.user.id)}>Remove</Button>}><ListItemText primary={member.user.name || "Unnamed player"} secondary={member.role} /></ListItem>)}</List>
        <Button onClick={deleteGroup} color="error" variant="outlined">Delete group</Button>
        <Button onClick={() => router.push(`/groups/${id}`)} variant="text">Back to group</Button>
      </Stack>
    </Container>
  );
}