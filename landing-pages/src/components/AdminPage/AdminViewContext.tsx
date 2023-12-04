import { createContext, useContext, useState } from 'react';

interface AdminViewInterface {
  listView: boolean;
  setListView: (value: boolean) => void;
}

export const AdminViewContext = createContext<AdminViewInterface | null>(null);

export function AdminViewProvider({ children }: { children: React.ReactNode }) {
  const [listView, setListView] = useState(false);

  return (
    <AdminViewContext.Provider value={{ listView, setListView }}>
      {children}
    </AdminViewContext.Provider>
  );
}

export function useAdminViewContext() {
  const context = useContext(AdminViewContext);

  if (!context) {
    throw new Error(
      'useAdminViewContext must be used within a AdminViewProvider'
    );
  }

  return context;
}
