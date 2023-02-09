import { AlertProps } from "@mui/material";
import React, { createContext, useContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Notification, { NotificationProps } from "@theme/Notification";

interface NotificationContextInterface {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  message: NotificationProps["message"];
  setMessage: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  severity: AlertProps["severity"];
  setSeverity: React.Dispatch<React.SetStateAction<AlertProps["severity"]>>;
  showNotification: (settings: NotificationSettings) => void;
}

type NotificationSettings = {
  message: NotificationContextInterface["message"];
  severity: NotificationContextInterface["severity"];
};

const NotificationContext = createContext<NotificationContextInterface | null>(
  null
);

type NotificationContextProviderProps = {
  children: React.ReactNode;
};

export function NotificationProvider({
  children,
}: NotificationContextProviderProps) {
  const [isOpen, setIsOpen] =
    useState<NotificationContextInterface["isOpen"]>(false);
  const [message, setMessage] = useState<
    NotificationContextInterface["message"]
  >(<></>);
  const [severity, setSeverity] =
    useState<NotificationContextInterface["severity"]>("info");

  function showNotification({ message, severity }: NotificationSettings) {
    setSeverity(severity);
    setMessage(message);
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <NotificationContext.Provider
      value={{
        isOpen,
        setIsOpen,
        message,
        setMessage,
        severity,
        setSeverity,
        showNotification,
      }}
    >
      {children}
      <Notification
        message={message}
        open={isOpen}
        onClose={handleClose}
        severity={severity}
      />
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const contextValue = useContext(NotificationContext);

  if (!contextValue) {
    throw new Error(
      "Please check that your app is wrapped in NotificationProvider"
    );
  }

  return contextValue;
};
