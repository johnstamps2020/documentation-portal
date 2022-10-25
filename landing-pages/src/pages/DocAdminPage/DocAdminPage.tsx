import { useEffect, useState } from "react";
import { DocConfig } from "@documentation-portal/dist/model/entity/DocConfig";
import { Build } from "@documentation-portal/dist/model/entity/Build";
import Button from "@mui/material/Button";
import Layout from "../../components/Layout/Layout";
import DocForm from "../../components/DocForm/DocForm";
import { Product } from "@documentation-portal/dist/model/entity/Product";
import { Release } from "@documentation-portal/dist/model/entity/Release";

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
    //TODO: change alert to MUI component (snackbar/state)
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

  const updateDoc = async (doc: DocConfig) => {
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
        alert("You successfully updated this document.");
        getDocData();
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
        alert("You successfully added new document.");
        getDocData();
      }
    }
  };

  function handleCreateNew() {
    memorizeDoc(emptyDoc);
    setShowForm(!showForm);
    setDocObject(emptyDoc);
  }

  if (docData) {
    return (
      <Layout title="Manage docs">
        <div className="pageBody">
          <div className="pageControllers">
            <Button variant="contained" onClick={handleCreateNew}>
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
              <DocForm
                docToDisplay={memorizedDoc}
                setShowForm={setShowForm}
                updateDoc={updateDoc}
                emptyDoc={emptyDoc}
                docObject={docObject}
                setDocObject={setDocObject}
              />
            )}
          </div>
        </div>
      </Layout>
    );
  } else {
    return <div style={{ height: 800 }}>Loading...</div>;
  }
}
