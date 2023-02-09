import {
  DocContextInterface,
  DocContextProviderProps,
} from "@theme/DocContext";
import React, { useState } from "react";

const DocContext = React.createContext<DocContextInterface | null>(null);

export function DocContextProvider(props: DocContextProviderProps) {
  const [userInformation, setUserInformation] =
    useState<DocContextInterface["userInformation"]>(undefined);
  const [availableVersions, setAvailableVersions] =
    useState<DocContextInterface["availableVersions"]>(undefined);
  const [isInternal, setIsInternal] =
    useState<DocContextInterface["isInternal"]>(false);
  const [isEarlyAccess, setIsEarlyAccess] =
    useState<DocContextInterface["isEarlyAccess"]>(false);
  const [searchMeta, setSearchMeta] =
    useState<DocContextInterface["searchMeta"]>(undefined);

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
      }}
    >
      {props.children}
    </DocContext.Provider>
  );
}

export const useDocContext = () => React.useContext(DocContext);

export const useFileList = () => {
  const contextValue = React.useContext(DocContext);

  if (!contextValue) {
    throw new Error("Please check that your app is wrapped in DocContext");
  }

  return contextValue;
};
