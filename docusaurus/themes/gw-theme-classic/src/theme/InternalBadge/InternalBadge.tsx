import React from "react";
import { useDocContext } from "@theme/DocContext";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";

export default function InternalBadge() {
  const { isInternal } = useDocContext();

  if (!isInternal) {
    return null;
  }

  return (
    <Tooltip title="This document is available only to people with a Guidewire email. Do not share the link with external stakeholders because they will not be able to see the contents.">
      <Chip color="warning" label="Internal" />
    </Tooltip>
  );
}
