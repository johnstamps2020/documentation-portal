import React, { createContext, useEffect, useState } from "react";
import { Doc } from "@documentation-portal/dist/model/entity/Doc";
import { Build } from "@documentation-portal/dist/model/entity/Build";
import Button from "@mui/material/Button";
import Layout from "../../components/Layout/Layout";
import DocForm from "../../components/DocForm/DocForm";
import { Product } from "@documentation-portal/dist/model/entity/Product";
import { Release } from "@documentation-portal/dist/model/entity/Release";
import Modal from "@mui/material/Modal";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { adminDocTheme } from "../../themes/adminDocTheme";

const emptyDoc: Doc = {
  id: "",
  title: "",
  url: "",
  body: "",
  products: [new Product()],
  releases: [new Release()],
  displayOnLandingPages: false,
  indexForSearch: false,
  public: false,
  internal: false,
  earlyAccess: false,
  build: new Build(),
  subjects: [""],
  isInProduction: false
};

export default function DocAdminPage() {
  const [docData, setDocData] = useState<Doc[]>();
  const [memorizedDoc, memorizeDoc] = useState<Doc>(emptyDoc);
  const [showForm, setShowForm] = useState(false);
  const [snack, setSnack] = useState({
    message: "",
    color: "",
    open: false
  });
  const SnackbarContext = createContext({});
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    getDocData();
  }, []);

  const getDocData = async () => {
    const response = await fetch(`/safeConfig/entity/Doc/all`);
    const jsonData = await response.json();
    setDocData(await jsonData);
  };

  const deleteDoc = async (id: string) => {
    setSnack({
      message: "",
      color: "",
      open: false
    });
    const data = {
      id: id
    };
    const response = await fetch(`/safeConfig/entity/Doc?id=${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      setSnack({
        message: "Successfully deleted document.",
        color: "green",
        open: true
      });
      getDocData();
    } else {
      setSnack({
        message: "Oops, something went wrong while deleting document.",
        color: "red",
        open: true
      });
    }
  };

  const updateDoc = async (doc: Doc) => {
    setSnack({
      message: "",
      color: "",
      open: false
    });
    //updating document
    if (doc && docData && docData.find(document => document.id === doc.id)) {
      const data = {
        id: doc.id,
        title: doc.title,
        url: doc.url,
        displayOnLandingPages: doc.displayOnLandingPages,
        indexForSearch: doc.indexForSearch,
        public: doc.public,
        internal: doc.internal,
        earlyAccess: doc.earlyAccess,
        products: doc.products,
        releases: doc.releases,
        subjects: null,
        categories: null,
        body: doc.body
      };

      const response = await fetch(`/safeConfig/entity/Doc?id=${doc.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      });

      const result = await response.json();
      console.log("result is: ", JSON.stringify(result, null, 4));
      if (response.ok) {
        setSnack({
          message: "Successfully updated document.",
          color: "green",
          open: true
        });
        getDocData();
      } else {
        setSnack({
          message: "Oops, something went wrong while updating document.",
          color: "red",
          open: true
        });
      }
    }
    //creating new document
    else {
      const data = {
        id: doc.id,
        title: doc.title,
        url: doc.url,
        displayOnLandingPages: doc.displayOnLandingPages,
        indexForSearch: doc.indexForSearch,
        public: doc.public,
        internal: doc.internal,
        earlyAccess: doc.earlyAccess,
        products: doc.products,
        releases: doc.releases,
        subjects: null,
        categories: null,
        body: doc.body
      };
      const response = await fetch(`/safeConfig/entity/Doc?id=`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      });

      const result = await response.json();
      console.log("result is: ", JSON.stringify(result, null, 4));
      if (response.ok) {
        setSnack({
          message: "Successfully added new document.",
          color: "green",
          open: true
        });
        getDocData();
      } else {
        setSnack({
          message: "Oops, something went wrong while adding new document.",
          color: "red",
          open: true
        });
      }
    }
  };

  function handleCreateNew() {
    handleOpen();
    memorizeDoc(emptyDoc);
    setShowForm(!showForm);
  }

  const showFormAndSetVar = (doc: Doc) => {
    handleOpen();
    memorizeDoc(doc);
  };

  return (
    <ThemeProvider theme={adminDocTheme}>
      <CssBaseline enableColorScheme />
      <Layout title="Manage docs">
        <div>
          <Button size={"large"} onClick={handleCreateNew}>
            Add new document
          </Button>
        </div>
        <div>
          <div style={{ columns: 3 }}>
            {docData ? (
              docData.map((doc: Doc) => (
                <div
                  key={doc.id}
                  style={{
                    width: 400,
                    height: 400,
                    marginBottom: 15,
                    breakInside: "avoid"
                  }}
                >
                  <div>{doc.title}</div>
                  <div>ID: {doc.id}</div>
                  <div>URL: {doc.url}</div>
                  <div>
                    Display on landing pages:{" "}
                    {String(doc.displayOnLandingPages)}
                  </div>
                  <div>Index for search: {String(doc.indexForSearch)}</div>
                  <div>Is public: {String(doc.public)}</div>
                  <div>Is internal: {String(doc.internal)}</div>
                  <div>Early access: {String(doc.earlyAccess)}</div>
                  <div>Subjects: {doc.subjects}</div>
                  <div>Body: {doc.body}</div>
                  <Button color="error" onClick={() => deleteDoc(doc.id)}>
                    Delete
                  </Button>
                  <Button
                    color="success"
                    onClick={() => showFormAndSetVar(doc)}
                  >
                    Update
                  </Button>
                </div>
              ))
            ) : (
              <Stack>
                <Skeleton variant="text" width={400} height={40} />
                <Skeleton variant="rectangular" width={400} height={300} />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Skeleton
                    variant="rounded"
                    width={200}
                    height={50}
                    sx={{ margin: "2%" }}
                  />
                  <Skeleton
                    variant="rounded"
                    width={200}
                    height={50}
                    sx={{ margin: "2%" }}
                  />
                </Box>
                <Skeleton variant="text" width={400} height={40} />
                <Skeleton variant="rectangular" width={400} height={300} />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Skeleton
                    variant="rounded"
                    width={200}
                    height={50}
                    sx={{ margin: "2%" }}
                  />
                  <Skeleton
                    variant="rounded"
                    width={200}
                    height={50}
                    sx={{ margin: "2%" }}
                  />
                </Box>
                <Skeleton variant="text" width={400} height={40} />
                <Skeleton variant="rectangular" width={400} height={300} />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Skeleton
                    variant="rounded"
                    width={200}
                    height={50}
                    sx={{ margin: "2%" }}
                  />
                  <Skeleton
                    variant="rounded"
                    width={200}
                    height={50}
                    sx={{ margin: "2%" }}
                  />
                </Box>
              </Stack>
            )}
          </div>
          <Modal open={open} onClose={handleClose}>
            <>
              <DocForm
                docToDisplay={memorizedDoc}
                setDocToDisplay={memorizeDoc}
                updateDoc={updateDoc}
                handleClose={handleClose}
              />
            </>
          </Modal>
          <SnackbarContext.Provider value={{ snack }}>
            <Snackbar
              open={snack.open}
              onClose={() => setSnack({ message: "", color: "", open: false })}
            >
              <Alert>{snack.message}</Alert>
            </Snackbar>
          </SnackbarContext.Provider>
        </div>
      </Layout>
    </ThemeProvider>
  );
}
