"use client";

import { Box, Switch, Typography } from "@mui/material";
import { useAppStore } from "@/stores/useAppStore";

export default function RoleToggle() {
  const role = useAppStore((s) => s.role);
  const toggleRole = useAppStore(
    (s) => s.toggleRole
  );

  return (
    <Box
      mt="auto"
      pt={3}
      borderTop="1px solid rgba(255,255,255,0.2)"
    >
      <Typography variant="body2">
        Role: {role.toUpperCase()}
      </Typography>

      <Box display="flex" alignItems="center">
        <Typography variant="caption">
          Editor
        </Typography>

        <Switch
          checked={role === "admin"}
          onChange={toggleRole}
          color="success"
        />

        <Typography variant="caption">
          Admin
        </Typography>
      </Box>
    </Box>
  );
}