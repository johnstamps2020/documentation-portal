import { ChangeEvent, useState } from "react";
import { DocConfig } from "@documentation-portal/dist/model/entity/DocConfig";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

type DocFormProps = {
  updateDoc: (doc: DocConfig) => Promise<void>;
  setShowForm: React.Dispatch<boolean>;
  docToDisplay: DocConfig;
  emptyDoc: DocConfig;
  docObject: DocConfig;
  setDocObject: React.Dispatch<React.SetStateAction<DocConfig>>;
};

export default function DocForm({
  updateDoc,
  setShowForm,
  docToDisplay,
  emptyDoc,
  docObject,
  setDocObject
}: DocFormProps) {
  const boolean = [
    {
      value: true,
      label: "True",
    },
    {
      value: false,
      label: "False",
    },
  ];

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

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        "& .MuiTextField-root": {
          marginTop: 1,
          padding: 2,
        },
        "& .MuiFormLabel-root": {
          color: "hsla(211, 22%, 20%, 0.24)",
        },
        backgroundColor: "white",
        borderRadius: 2,
        height: 600,
        width: 450,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        overflow: "scroll",
      }}
      noValidate
      autoComplete="off"
      position="fixed"
    >
      <div>
        <TextField
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
          value={docObject.title}
          onChange={updateField}
          fullWidth
        />
        <TextField
          id="url"
          label="URL"
          variant="outlined"
          value={docObject.url}
          onChange={updateField}
          fullWidth
        />
        <TextField
          id="displayOnLandingPages"
          label="displayOnLandingPages"
          variant="outlined"
          select
          value={docObject.displayOnLandingPages}
          onChange={updateField}
          fullWidth
        >
          {boolean.map((option) => (
            <MenuItem key={String(option.value)} value={String(option.value)}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="indexForSearch"
          label="indexForSearch"
          variant="outlined"
          select
          value={docObject.indexForSearch}
          onChange={updateField}
          fullWidth
        >
          {boolean.map((option) => (
            <MenuItem key={String(option.value)} value={String(option.value)}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <br />
        <div>
          <Button type="submit" color="success" fullWidth>
            Save changes
          </Button>
          <br />
          <Button
            type="button"
            onClick={() => setShowForm(false)}
            color="error"
            fullWidth
          >
            Close
          </Button>
        </div>
      </div>
    </Box>
  );
}
