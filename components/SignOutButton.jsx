"use client";

import { signOut } from "next-auth/react";
import { Button } from "@mui/material";

export default function SignOutButton() {
  return (
    <Button
      variant="outlined"
      onClick={() => signOut({ callbackUrl: "/signin" })}
      sx={{
        "&:hover": {
          color: "#fff",
          backgroundColor: "error.main",
          borderColor: "error.main",
        },
      }}
    >
      Sign out
    </Button>
  );
}