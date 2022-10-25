import { ChangeEvent, useState } from "react";
import { DocConfig } from "@documentation-portal/dist/model/entity/DocConfig";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React from "react";

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

  const textFieldSize = "small";
  return (
    //TODO: Change switch value from "ON" and "OFF" to true and false
    <Box component="form" onSubmit={handleSubmit} sx={style}>
      <div>
        <TextField
          size={textFieldSize}
          id="id"
          label="ID"
          variant="outlined"
          value={docObject.id}
          onChange={updateField}
          fullWidth
        />
        <TextField
          id="title"
          label="Title"
          variant="outlined"
          size={textFieldSize}
          value={docObject.title}
          onChange={updateField}
          fullWidth
        />
        <TextField
          id="url"
          label="URL"
          variant="outlined"
          size={textFieldSize}
          value={docObject.url}
          onChange={updateField}
          fullWidth
        />
        <br />
        <div>
          <Button type="submit" color="success" fullWidth>
            Save changes
          </Button>
          <br />
          <Button type="button" color="error" fullWidth onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    </Box>
  );
}
