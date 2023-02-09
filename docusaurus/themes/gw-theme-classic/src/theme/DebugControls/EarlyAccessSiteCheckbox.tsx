import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useDocContext } from "@theme/DocContext";
import React from "react";

export default function EarlyAccessSiteCheckbox() {
  const { isEarlyAccess, setIsEarlyAccess } = useDocContext();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setIsEarlyAccess(event.target.checked);
  }

  return (
    <FormControlLabel
      control={<Checkbox checked={isEarlyAccess} onChange={handleChange} />}
      label="Set the site as early access"
    />
  );
}
