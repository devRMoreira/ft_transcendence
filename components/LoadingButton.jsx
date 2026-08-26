"use client";

import { Button, CircularProgress } from "@mui/material";

export default function LoadingButton({ loading, disabled, children, ...props }) {
  return (
    <Button disabled={loading || disabled} {...props}>
      {loading ? <CircularProgress size={24} color="inherit" /> : children}
    </Button>
  );
}