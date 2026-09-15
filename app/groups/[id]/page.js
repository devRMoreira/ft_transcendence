"use client";

import Link from "next/link";
import { Alert, Button, Checkbox, Container, FormControlLabel, List, ListItem, ListItemText, Stack, TextField, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GroupDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [content, setContent] = useState("");
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [error, setError] = useState("");

  async function loadGroup() {
    const response = await fetch(`/api/groups/${id}`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to load group");
    setData(result);
  }

  useEffect(() => {
    fetch(`/api/groups/${id}`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Unable to load group");
        setData(result);
      })
      .catch((loadError) => setError(loadError.message));
  }, [id]);

  async function createPost(event) {
    event.preventDefault();
    const response = await fetch(`/api/groups/${id}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, isAnnouncement }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Unable to create post");
      return;
    }
    setContent("");
    setIsAnnouncement(false);
    loadGroup().catch((loadError) => setError(loadError.message));
  }

  async function leaveGroup() {
    const response = await fetch(`/api/groups/${id}/leave`, { method: "POST" });
    if (!response.ok) {
      const result = await response.json();
      setError(result.error || "Unable to leave group");
      return;
    }
    router.push("/groups");
  }

  if (error && !data) return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
  if (!data) return null;

  const announcements = data.group.posts.filter((post) => post.isAnnouncement);
  const posts = data.group.posts.filter((post) => !post.isAnnouncement);

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Stack spacing={3}>
        <Typography component="h1" variant="h3">{data.group.name}</Typography>
        <Typography>{data.group.description || "No description"}</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Stack direction="row" spacing={2}>
          {data.role === "ADMIN" && <Button component={Link} href={`/groups/${id}/settings`} variant="outlined">Settings</Button>}
          <Button onClick={leaveGroup} color="warning" variant="outlined">Leave group</Button>
        </Stack>
        <Typography variant="h5">Announcements</Typography>
        <List>{announcements.map((post) => <ListItem key={post.id}><ListItemText primary={post.content} secondary={post.author.name || "Unknown"} /></ListItem>)}</List>
        <Typography variant="h5">Members</Typography>
        <List>{data.group.members.map((member) => <ListItem key={member.id}><ListItemText primary={member.user.name || "Unnamed player"} secondary={member.role} /></ListItem>)}</List>
        <Typography variant="h5">Posts</Typography>
        <List>{posts.map((post) => <ListItem key={post.id}><ListItemText primary={post.content} secondary={post.author.name || "Unknown"} /></ListItem>)}</List>
        <Stack component="form" spacing={2} onSubmit={createPost}>
          <TextField label="Write a post" value={content} onChange={(event) => setContent(event.target.value)} multiline required />
          {data.role === "ADMIN" && <FormControlLabel control={<Checkbox checked={isAnnouncement} onChange={(event) => setIsAnnouncement(event.target.checked)} />} label="Announcement" />}
          <Button type="submit" variant="contained">Publish</Button>
		  <Button component={Link} href="/" variant="text">Back home</Button>
        </Stack>
      </Stack>
    </Container>
  );
}