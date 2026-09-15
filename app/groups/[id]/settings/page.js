"use client";

import { Alert, Button, Container, List, ListItem, ListItemText, Stack, TextField, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GroupSettingsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [group, setGroup] = useState(null);
  const [description, setDescription] = useState("");
  const [requests, setRequests] = useState([]);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const groupResponse = await fetch(`/api/groups/${id}`);
    const groupData = await groupResponse.json();
    if (!groupResponse.ok || groupData.role !== "ADMIN") throw new Error("Only admins can access settings");
    setGroup(groupData.group);
    setDescription(groupData.group.description || "");
    const requestsResponse = await fetch(`/api/groups/${id}/requests`);
    if (requestsResponse.ok) setRequests((await requestsResponse.json()).requests);
  }

  useEffect(() => {
    fetch(`/api/groups/${id}`)
      .then(async (response) => {
        const groupData = await response.json();
        if (!response.ok || groupData.role !== "ADMIN") throw new Error("Only admins can access settings");
        setGroup(groupData.group);
        setDescription(groupData.group.description || "");
        const requestsResponse = await fetch(`/api/groups/${id}/requests`);
        if (requestsResponse.ok) setRequests((await requestsResponse.json()).requests);
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
    const response = await fetch(`/api/groups/${id}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) setError((await response.json()).error || "Unable to invite member");
    else setUserId("");
  }

  async function decideRequest(requestId, decision) {
    const response = await fetch(`/api/groups/${id}/requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    });
    if (!response.ok) setError((await response.json()).error || "Unable to process request");
    else load().catch((loadError) => setError(loadError.message));
  }

  async function removeMember(memberId) {
    const response = await fetch(`/api/groups/${id}/members/${memberId}`, { method: "DELETE" });
    if (!response.ok) setError((await response.json()).error || "Unable to remove member");
    else load().catch((loadError) => setError(loadError.message));
  }

  if (error && !group) return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
  if (!group) return null;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Stack spacing={3}>
        <Typography component="h1" variant="h4">Group settings</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Stack component="form" spacing={2} onSubmit={updateDescription}>
          <TextField label="Description" value={description} onChange={(event) => setDescription(event.target.value)} inputProps={{ maxLength: 300 }} multiline minRows={3} />
          <Button type="submit" variant="contained">Save description</Button>
        </Stack>
        <Stack component="form" spacing={2} onSubmit={inviteMember}>
          <Typography variant="h6">Invite a player</Typography>
          <TextField label="Player ID" value={userId} onChange={(event) => setUserId(event.target.value)} required />
          <Button type="submit" variant="outlined">Send invitation</Button>
        </Stack>
        <Typography variant="h6">Join requests</Typography>
        <List>{requests.map((request) => <ListItem key={request.id} secondaryAction={<Stack direction="row" spacing={1}><Button onClick={() => decideRequest(request.id, "ACCEPTED")}>Accept</Button><Button onClick={() => decideRequest(request.id, "REJECTED")}>Reject</Button></Stack>}><ListItemText primary={request.user.name || request.user.email} /></ListItem>)}</List>
        <Typography variant="h6">Members</Typography>
        <List>{group.members.map((member) => <ListItem key={member.id} secondaryAction={member.role !== "ADMIN" && <Button color="error" onClick={() => removeMember(member.user.id)}>Remove</Button>}><ListItemText primary={member.user.name || "Unnamed player"} secondary={member.role} /></ListItem>)}</List>
        <Button onClick={() => router.push(`/groups/${id}`)} variant="text">Back to group</Button>
      </Stack>
    </Container>
  );
}