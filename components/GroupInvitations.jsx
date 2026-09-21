"use client";

import { Alert, Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function GroupInvitations() {
  const [invitations, setInvitations] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/groups/invitations")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load invitations");
        setInvitations(data.invitations);
      })
      .catch((loadError) => setError(loadError.message));
  }, []);

  async function decideInvitation(invitationId, decision) {
    const response = await fetch(`/api/groups/invitations/${invitationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Unable to process invitation");
      return;
    }

    if (decision === "ACCEPTED") {
      window.location.reload();
      return;
    }

    setInvitations((current) => current.filter((invitation) => invitation.id !== invitationId));
  }

  if (error) return <Alert severity="error">{error}</Alert>;
  if (invitations.length === 0) return null;

  return (
    <Stack spacing={2}>
      <Button variant="outlined" onClick={() => setOpen((current) => !current)}>
        You have {invitations.length} group invitation{invitations.length === 1 ? "" : "s"}
      </Button>
      {open && invitations.map((invitation) => (
        <Stack key={invitation.id} spacing={1} sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
          <Typography>
            {invitation.invitedBy.name || invitation.invitedBy.email} invited you to join {invitation.group.name}.
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={() => decideInvitation(invitation.id, "ACCEPTED")}>
              Accept
            </Button>
            <Button variant="outlined" color="error" onClick={() => decideInvitation(invitation.id, "REJECTED")}>
              Reject
            </Button>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}