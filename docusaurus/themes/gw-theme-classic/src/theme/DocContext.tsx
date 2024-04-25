import {
  DocContextInterface,
  DocContextProviderProps,
} from '@theme/DocContext';
import React, { useEffect, useState } from 'react';

const DocContext = React.createContext<DocContextInterface | null>(null);

export function DocContextProvider(props: DocContextProviderProps) {
  const [userInformation, setUserInformation] =
    useState<DocContextInterface['userInformation']>(undefined);
  const [availableVersions, setAvailableVersions] =
    useState<DocContextInterface['availableVersions']>(undefined);
  const [isInternal, setIsInternal] =
    useState<DocContextInterface['isInternal']>(false);
  const [isEarlyAccess, setIsEarlyAccess] =
    useState<DocContextInterface['isEarlyAccess']>(false);
  const [searchMeta, setSearchMeta] =
    useState<DocContextInterface['searchMeta']>(undefined);
  const [authors, setAuthors] = useState<DocContextInterface['authors']>([]);
  const [isProd, setIsProd] = useState(false);

  useEffect(() => {
    if (window.location.hostname === 'docs.guidewire.com') {
      setIsProd(true);
    }
  }, []);

  return (
    <DocContext.Provider
      value={{
        userInformation,
        setUserInformation,
        availableVersions,
        setAvailableVersions,
        isInternal,
        setIsInternal,
        isEarlyAccess,
        setIsEarlyAccess,
        searchMeta,
        setSearchMeta,
        authors,
        setAuthors,
        isProd,
      }}
    >
      {props.children}
    </DocContext.Provider>
  );
}

export const useDocContext = () => {
  const contextValue = React.useContext(DocContext);

  if (!contextValue) {
    throw new Error('Please check that your app is wrapped in DocContext');
  }

  return contextValue;
};

export const useFileList = () => {
  const contextValue = React.useContext(DocContext);

  if (!contextValue) {
    throw new Error('Please check that your app is wrapped in DocContext');
  }

  return contextValue;
};
