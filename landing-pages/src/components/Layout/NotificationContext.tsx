import { createContext, useContext, useState } from 'react';
import Notification, { NotificationProps } from './Notification';

interface NotificationContextInterface {
  showMessage: (
    text: NotificationProps['text'],
    severity: NotificationProps['severity']
  ) => void;
}

export const NotificationContext =
  createContext<NotificationContextInterface | null>(null);

type NotificationContextProviderProps = {
  children: React.ReactNode;
};

export function NotificationProvider({
  children,
}: NotificationContextProviderProps) {
  const [text, setText] = useState<NotificationProps['text']>('');
  const [severity, setSeverity] =
    useState<NotificationProps['severity']>('info');
  const [isOpen, setIsOpen] = useState<NotificationProps['isOpen']>(false);

  const showMessage: NotificationContextInterface['showMessage'] = (
    text,
    severity
  ) => {
    setSeverity(severity);
    setText(text);
    setIsOpen(true);
  };

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <NotificationContext.Provider value={{ showMessage }}>
      {children}
      <Notification
        text={text}
        severity={severity}
        isOpen={isOpen}
        onClose={handleClose}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }

  return context;
}
