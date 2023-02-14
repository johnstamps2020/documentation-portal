import React, { useState } from "react";
import Button from "@mui/material/Button";
import { usePluginData } from "@docusaurus/useGlobalData";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import DataDisplay from "./DataDisplay";
import { PluginData } from "@theme/Types";
import { PLUGIN_NAME } from "../../types/constants";

export default function PluginDataPreview() {
  const pluginData = usePluginData(PLUGIN_NAME) as PluginData;
  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <>
      <Button onClick={handleOpen}>Preview plugin data</Button>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Plugin data</DialogTitle>
        <DialogContent>
          {Object.entries(pluginData).map(([key, value]) => (
            <Grid2 container spacing={2} key={key}>
              <Grid2 xs={3}>
                <Typography>{key}</Typography>
              </Grid2>
              <Grid2 xs={9}>
                <DataDisplay data={value} />
              </Grid2>
            </Grid2>
          ))}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
