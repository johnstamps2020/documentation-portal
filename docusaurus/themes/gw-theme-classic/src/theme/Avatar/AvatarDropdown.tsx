import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import DebugControls from "@theme/DebugControls";
import { useDocContext } from "@theme/DocContext";
import Stack from "@mui/material/Stack";

export default function AvatarDropdown() {
  const { userInformation } = useDocContext();

  return (
    <Paper sx={{ padding: "24px", minWidth: "300px" }}>
      <Stack>
        <Typography>{userInformation.name}</Typography>
        <Typography color="GrayText">
          {userInformation.preferred_username}
        </Typography>
        <Divider sx={{ margin: "1rem 0" }} />
        <a href="/gw-logout">Log out</a>
        <DebugControls />
      </Stack>
    </Paper>
  );
}
