import React from "react";
import IconButton from "@mui/material/IconButton";
import AvatarIcon from "./avatar-icon.svg";

export default function AvatarButton() {
  return (
    <IconButton
      sx={{
        backgroundColor: "white",
        width: "32px",
        height: "32px",
        padding: 0,
        "&:hover": {
          backgroundColor: "var(--ifm-color-primary)",
          color: "white",
        },
      }}
    >
      <AvatarIcon />
    </IconButton>
  );
}
