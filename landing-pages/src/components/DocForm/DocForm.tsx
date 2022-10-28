import { ChangeEvent } from "react";
import { DocConfig } from "@documentation-portal/dist/model/entity/DocConfig";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type DocFormProps = {
  updateDoc: (doc: DocConfig) => Promise<void>;
  docToDisplay: DocConfig;
  docObject: DocConfig;
  setDocObject: React.Dispatch<React.SetStateAction<DocConfig>>;
  handleClose: () => void;
};

export default function DocForm({
  updateDoc,
  docToDisplay,
  docObject,
  setDocObject,
  handleClose,
}: DocFormProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateDoc(docToDisplay);
  }

  function updateField(event: ChangeEvent<HTMLInputElement>) {
    setDocObject((currentDoc) => {
      return {
        ...currentDoc,
        [event.target.id]: event.target.value,
      };
    });
  }

  function updateSwitch(event: ChangeEvent<HTMLInputElement>) {
    setDocObject((currentDoc) => {
      return {
        ...currentDoc,
        [event.target.id]: event.target.checked,
      };
    });
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={style}>
      <div>
        <TextField
          id="id"
          label="ID"
          value={docObject.id}
          onChange={updateField}
        />
        <TextField
          id="title"
          label="Title"
          value={docObject.title}
          onChange={updateField}
        />
        <TextField
          id="url"
          label="URL"
          value={docObject.url}
          onChange={updateField}
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                onChange={updateSwitch}
                id="displayOnLandingPages"
                checked={docObject.displayOnLandingPages}
              />
            }
            label="Display on landing pages"
          />
          <FormControlLabel
            control={
              <Switch
                onChange={updateSwitch}
                id="indexForSearch"
                checked={docObject.indexForSearch}
              />
            }
            label="Index for search"
          />
        </FormGroup>
        <br />
        <div>
          <Button type="submit" color="success" fullWidth>
            Save changes
          </Button>
          <br />
          <Button color="error" fullWidth onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    </Box>
  );
}
