import { ChangeEvent, useEffect, useState } from "react";
import { DocConfig } from "@documentation-portal/dist/model/entity/DocConfig";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Layout from "../../components/Layout/Layout";

export default function DocAdminPage() {
  const [docData, setDocData] = useState<DocConfig[]>();
  const [docObject, setDocObject] = useState(new DocConfig());
  const [memorizedDoc, memorizeDoc] = useState<DocConfig>();
  const [showForm, setShowForm] = useState(false);

  function updateField(event: ChangeEvent<HTMLInputElement>) {
    setDocObject((currentDoc) => {
      return {
        ...currentDoc,
        [event.target.id]: event.target.value,
      };
    });
  }

  useEffect(() => {
    getDocData();
  }, []);

  const getDocData = async () => {
    const response = await fetch(`/safeConfig/entity/DocConfig/all`);
    const jsonData = await response.json();
    setDocData(await jsonData);
  };

  const deleteDoc = async (id: string) => {
    const data = {
      id: id,
    };
    const response = await fetch(`/safeConfig/entity/DocConfig?id=${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("You did it! We no longer have this document in the database.");
      getDocData();
    }
  };

  const showFormAndSetVar = (doc: DocConfig) => {
    setShowForm(!showForm);
    setDocObject(doc);
    memorizeDoc(doc);
  };

  const updateDoc = async (doc: DocConfig | undefined) => {
    setShowForm(!showForm);
    //updating document
    if (doc) {
      const data = {
        id: doc.id,
        title: docObject.title,
        url: docObject.url,
        environments: [docObject.environments],
        displayOnLandingPages: docObject.displayOnLandingPages,
        indexForSearch: docObject.indexForSearch,
        public: docObject.public,
        internal: docObject.internal,
        earlyAccess: docObject.earlyAccess,
        products: docObject.products,
        releases: docObject.releases,
        subjects: docObject.subjects,
        categories: docObject.categories,
        body: docObject.body,
      };

      const response = await fetch(
        `/safeConfig/entity/DocConfig?id=${doc.id}`,
        {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();
      console.log("result is: ", JSON.stringify(result, null, 4));
      if (response.ok) {
        alert("You successfully updated this document.");
        getDocData();
      }
    }
    //creating new document
    else {
      memorizeDoc(undefined);
      const data = {
        id: docObject.id,
        title: docObject.title,
        url: docObject.url,
        environments: docObject.environments,
        displayOnLandingPages: docObject.displayOnLandingPages,
        indexForSearch: docObject.indexForSearch,
        public: docObject.public,
        internal: docObject.internal,
        earlyAccess: docObject.earlyAccess,
        products: docObject.products,
        releases: docObject.releases,
        subjects: docObject.subjects,
        categories: docObject.categories,
        body: docObject.body,
      };

      const response = await fetch(`/safeConfig/entity/DocConfig?id=`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const result = await response.json();
      console.log("result is: ", JSON.stringify(result, null, 4));
      if (response.ok) {
        alert("You successfully added new document.");
        getDocData();
      }
    }
  };

  //TODO: przeniesc odpowiednio do nowych folderow

  //TODO: zmienic formularz ze stanami na nowy stan i zmienić
  //form na https://mui.com/material-ui/react-text-field/

  if (docData) {
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
    return (
      <Layout title="Manage docs">
        <div className="pageBody">
          <div className="pageControllers">
            <Button variant="contained" onClick={() => setShowForm(!showForm)}>
              Add new document
            </Button>
          </div>
          <div className="content">
            {docData.map((doc: DocConfig) => (
              <div
                key={doc.id}
                className="categoryCard cardShadow"
                style={{ width: 400, height: "fit-content" }}
              >
                <div className="label">{doc.title}</div>
                <div>ID: {doc.id}</div>
                <div>URL: {doc.url}</div>
                <div>
                  Display on landing pages: {String(doc.displayOnLandingPages)}
                </div>
                <div>Index for search: {String(doc.indexForSearch)}</div>
                <div>Is public: {String(doc.public)}</div>
                <div>Is internal: {String(doc.internal)}</div>
                <div>Early access: {String(doc.earlyAccess)}</div>
                <div>Subjects: {doc.subjects}</div>
                <div>Categories: {doc.categories}</div>
                <div>Body: {doc.body}</div>
                <Button onClick={() => deleteDoc(doc.id)}>Delete</Button>
                <Button onClick={() => showFormAndSetVar(doc)}>Update</Button>
              </div>
            ))}
            {showForm && (
              <Box
                component="form"
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
                    id="environments"
                    label="Environments"
                    variant="outlined"
                    value={docObject.environments}
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
                      <MenuItem
                        key={String(option.value)}
                        value={String(option.value)}
                      >
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
                      <MenuItem
                        key={String(option.value)}
                        value={String(option.value)}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <br />
                  <div>
                    <Button
                      type="submit"
                      onClick={() => updateDoc(memorizedDoc)}
                      color="success"
                      fullWidth
                    >
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
            )}
          </div>
        </div>
      </Layout>
    );
  } else {
    return <div style={{ height: 800 }}>Loading...</div>;
  }
}
