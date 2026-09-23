"use client";

import Link from "next/link";
import { Alert, Box, Button, Checkbox, Container, FormControlLabel, List, ListItem, ListItemText, Stack, TextField, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GroupDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [content, setContent] = useState("");
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [error, setError] = useState("");

  const editWindowMs = 10 * 60 * 1000;

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

  function startEditing(post) {
    if (Date.now() - new Date(post.createdAt).getTime() > editWindowMs) {
      setError("Posts can only be edited within 10 minutes of publishing");
      return;
    }

    setEditingPostId(post.id);
    setEditingContent(post.content);
    setError("");
  }

  function cancelEditing() {
    setEditingPostId(null);
    setEditingContent("");
  }

  async function updatePost(event) {
    event.preventDefault();
    const response = await fetch(`/api/groups/${id}/posts/${editingPostId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editingContent }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Unable to edit post");
      return;
    }
    cancelEditing();
    loadGroup().catch((loadError) => setError(loadError.message));
  }

  function renderPost(post) {
    const isWithinEditWindow = Date.now() - new Date(post.createdAt).getTime() <= editWindowMs;
    const canEdit = isWithinEditWindow && (post.author.id === data.currentUserId || (post.isAnnouncement && data.role === "ADMIN"));
    if (editingPostId === post.id) {
      return (
        <ListItem key={post.id}>
          <Stack component="form" spacing={1} onSubmit={updatePost} sx={{ width: "100%" }}>
            <TextField value={editingContent} onChange={(event) => setEditingContent(event.target.value)} multiline required fullWidth />
            <Stack direction="row" spacing={1}>
              <Button type="submit" size="small" variant="contained">Save</Button>
              <Button type="button" size="small" onClick={cancelEditing}>Cancel</Button>
            </Stack>
          </Stack>
        </ListItem>
      );
    }

    return (
      <ListItem key={post.id} secondaryAction={canEdit && <Button size="small" onClick={() => startEditing(post)}>Edit</Button>}>
        <ListItemText primary={post.content} secondary={post.author.name || "Unknown"} />
      </ListItem>
    );
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
        <List>{announcements.map(renderPost)}</List>
        <Typography variant="h5">Members</Typography>
        <List>{data.group.members.map((member) => <ListItem key={member.id}><ListItemText primary={member.user.name || "Unnamed player"} secondary={member.role} /></ListItem>)}</List>
        <Typography variant="h5">Posts</Typography>
        <Box sx={{ maxHeight: 320, overflowY: "auto", border: 1, borderColor: "divider", borderRadius: 1 }}>
          <List>{posts.map(renderPost)}</List>
        </Box>
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