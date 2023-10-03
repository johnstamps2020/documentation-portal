import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { useLayoutContext } from 'LayoutContext';
import DocForm from 'components/DocForm/DocForm';
import { useNotification } from 'components/Layout/NotificationContext';
import React, { useEffect, useState } from 'react';
import { Doc } from 'server/dist/model/entity/Doc';
import { Language } from 'server/dist/model/entity/Language';
import { Release } from 'server/dist/model/entity/Release';
import { Subject } from 'server/dist/model/entity/Subject';

const emptyDoc: Doc = {
  uuid: '',
  id: '',
  title: '',
  url: '',
  body: '',
  platformProductVersions: [],
  releases: [new Release()],
  displayOnLandingPages: false,
  indexForSearch: false,
  public: false,
  internal: false,
  earlyAccess: false,
  subjects: [new Subject()],
  isInProduction: false,
  language: new Language(),
};

export default function DocAdminPage() {
  const { showMessage } = useNotification();
  const { setTitle } = useLayoutContext();
  const [docData, setDocData] = useState<Doc[]>();
  const [memorizedDoc, memorizeDoc] = useState<Doc>(emptyDoc);
  const [showForm, setShowForm] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getDocData = async () => {
    const response = await fetch(`/safeConfig/entity/Doc/all`);
    const jsonData = await response.json();
    setDocData(await jsonData);
  };

  useEffect(() => {
    getDocData().then((r) => r);
  }, []);

  useEffect(() => {
    setTitle('Manage docs');
  }, [setTitle]);

  const deleteDoc = async (id: string) => {
    const data = {
      id: id,
    };
    const response = await fetch(`/safeConfig/entity/Doc?id=${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      showMessage('Successfully deleted document.', 'success');
      await getDocData();
    } else {
      showMessage(
        'Oops, something went wrong while deleting document.',
        'error'
      );
    }
  };

  const updateDoc = async (doc: Doc) => {
    //updating document
    if (doc && docData && docData.find((document) => document.id === doc.id)) {
      const data = {
        id: doc.id,
        title: doc.title,
        url: doc.url,
        displayOnLandingPages: doc.displayOnLandingPages,
        indexForSearch: doc.indexForSearch,
        public: doc.public,
        internal: doc.internal,
        earlyAccess: doc.earlyAccess,
        releases: doc.releases,
        subjects: doc.subjects,
        categories: null,
        body: doc.body,
      };

      const response = await fetch(`/safeConfig/entity/Doc?id=${doc.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const result = await response.json();
      console.log('result is: ', JSON.stringify(result, null, 4));
      if (response.ok) {
        showMessage('Successfully updated document.', 'success');
        await getDocData();
      } else {
        showMessage(
          'Oops, something went wrong while updating document.',
          'error'
        );
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
        releases: doc.releases,
        subjects: doc.subjects,
        categories: null,
        body: doc.body,
      };
      const response = await fetch(`/safeConfig/entity/Doc?id=`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const result = await response.json();
      console.log('result is: ', JSON.stringify(result, null, 4));
      if (response.ok) {
        showMessage('Successfully added new document.', 'success');
        await getDocData();
      } else {
        showMessage(
          'Oops, something went wrong while adding new document.',
          'error'
        );
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
    <>
      <div>
        <Button size={'large'} onClick={handleCreateNew}>
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
                  breakInside: 'avoid',
                }}
              >
                <div>{doc.title}</div>
                <div>ID: {doc.id}</div>
                <div>URL: {doc.url}</div>
                <div>
                  Display on landing pages: {String(doc.displayOnLandingPages)}
                </div>
                <div>Index for search: {String(doc.indexForSearch)}</div>
                <div>Is public: {String(doc.public)}</div>
                <div>Is internal: {String(doc.internal)}</div>
                <div>Early access: {String(doc.earlyAccess)}</div>
                <div>Body: {doc.body}</div>
                <Button color="error" onClick={() => deleteDoc(doc.id)}>
                  Delete
                </Button>
                <Button color="success" onClick={() => showFormAndSetVar(doc)}>
                  Update
                </Button>
              </div>
            ))
          ) : (
            <Stack>
              <Skeleton variant="text" width={400} height={40} />
              <Skeleton variant="rectangular" width={400} height={300} />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Skeleton
                  variant="rounded"
                  width={200}
                  height={50}
                  sx={{ margin: '2%' }}
                />
                <Skeleton
                  variant="rounded"
                  width={200}
                  height={50}
                  sx={{ margin: '2%' }}
                />
              </Box>
              <Skeleton variant="text" width={400} height={40} />
              <Skeleton variant="rectangular" width={400} height={300} />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Skeleton
                  variant="rounded"
                  width={200}
                  height={50}
                  sx={{ margin: '2%' }}
                />
                <Skeleton
                  variant="rounded"
                  width={200}
                  height={50}
                  sx={{ margin: '2%' }}
                />
              </Box>
              <Skeleton variant="text" width={400} height={40} />
              <Skeleton variant="rectangular" width={400} height={300} />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Skeleton
                  variant="rounded"
                  width={200}
                  height={50}
                  sx={{ margin: '2%' }}
                />
                <Skeleton
                  variant="rounded"
                  width={200}
                  height={50}
                  sx={{ margin: '2%' }}
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
      </div>
    </>
  );
}
