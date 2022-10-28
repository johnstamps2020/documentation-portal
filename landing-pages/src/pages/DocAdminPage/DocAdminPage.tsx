import { createContext, useEffect, useState } from "react";
import { DocConfig } from "@documentation-portal/dist/model/entity/DocConfig";
import { Build } from "@documentation-portal/dist/model/entity/Build";
import Button from "@mui/material/Button";
import Layout from "../../components/Layout/Layout";
import DocForm from "../../components/DocForm/DocForm";
import { Product } from "@documentation-portal/dist/model/entity/Product";
import { Release } from "@documentation-portal/dist/model/entity/Release";
import React from "react";
import Modal from "@mui/material/Modal";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const emptyDoc: DocConfig = {
  id: "",
  title: "",
  url: "",
  body: "",
  products: [new Product()],
  releases: [new Release()],
  environments: "",
  displayOnLandingPages: false,
  indexForSearch: false,
  public: false,
  internal: false,
  earlyAccess: false,
  build: new Build(),
  subjects: "",
  categories: "",
};

export default function DocAdminPage() {
  const [docData, setDocData] = useState<DocConfig[]>();
  const [docObject, setDocObject] = useState(emptyDoc);
  const [memorizedDoc, memorizeDoc] = useState<DocConfig>(emptyDoc);
  const [showForm, setShowForm] = useState(false);
  const [snack, setSnack] = useState({
    message: "",
    color: "",
    open: false,
  });
  const SnackbarContext = createContext({});
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    getDocData();
  }, []);

  const getDocData = async () => {
    const response = await fetch(`/safeConfig/entity/DocConfig/all`);
    const jsonData = await response.json();
    setDocData(await jsonData);
  };

  const deleteDoc = async (id: string) => {
    setSnack({
      message: "",
      color: "",
      open: false,
    });
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
    //TODO: change alert to MUI component (snackbar/state)
    if (response.ok) {
      setSnack({
        message: "Successfully deleted document.",
        color: "green",
        open: true,
      });
      getDocData();
    } else {
      setSnack({
        message: "Oops, something went wrong while deleting document.",
        color: "red",
        open: true,
      });
    }
  };

  const updateDoc = async (doc: DocConfig) => {
    setSnack({
      message: "",
      color: "",
      open: false,
    });
    //updating document
    if (doc && doc !== emptyDoc) {
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
        subjects: null,
        categories: null,
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
        //TODO: change alert to MUI component (snackbar/state)
        setSnack({
          message: "Successfully updated document.",
          color: "green",
          open: true,
        });
        getDocData();
      } else {
        setSnack({
          message: "Oops, something went wrong while updating document.",
          color: "red",
          open: true,
        });
      }
    }
    //creating new document
    else {
      const data = {
        id: docObject.id,
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
        subjects: null,
        categories: null,
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
        //TODO: change alert to MUI component (snackbar/state)
        setSnack({
          message: "Successfully added new document.",
          color: "green",
          open: true,
        });
        getDocData();
      } else {
        setSnack({
          message: "Oops, something went wrong while adding new document.",
          color: "red",
          open: true,
        });
      }
    }
  };

  function handleCreateNew() {
    handleOpen();
    memorizeDoc(emptyDoc);
    setShowForm(!showForm);
    setDocObject(emptyDoc);
  }

  const showFormAndSetVar = (doc: DocConfig) => {
    handleOpen();
    setDocObject(doc);
    memorizeDoc(doc);
  };

  if (docData) {
    return (
      <Layout title="Manage docs">
        <div>
          <div>
            <Button variant="contained" onClick={handleCreateNew}>
              Add new document
            </Button>
          </div>
          <div>
            {docData.map((doc: DocConfig) => (
              <div key={doc.id} style={{ width: 400, height: "fit-content" }}>
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
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <>
                <DocForm
                  docToDisplay={memorizedDoc}
                  updateDoc={updateDoc}
                  docObject={docObject}
                  setDocObject={setDocObject}
                  handleClose={handleClose}
                />
              </>
            </Modal>
            <SnackbarContext.Provider value={{ snack }}>
              <Snackbar
                open={snack.open}
                autoHideDuration={3000}
                onClose={() =>
                  setSnack({ message: "", color: "", open: false })
                }
              >
                <Alert sx={{ width: "100%" }}>{snack.message}</Alert>
              </Snackbar>
            </SnackbarContext.Provider>
          </div>
        </div>
      </Layout>
    );
  } else {
    return <div style={{ height: 800 }}>Loading...</div>;
  }
}
