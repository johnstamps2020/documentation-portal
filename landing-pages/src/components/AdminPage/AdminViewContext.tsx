import React, { createContext, useContext, useState } from 'react';
import { Entity } from './EntityListWithFilters';

interface AdminViewInterface {
  listView: boolean;
  setListView: (value: boolean) => void;
  selectedEntities: Entity[];
  setSelectedEntities: React.Dispatch<React.SetStateAction<Entity[]>>;
}

export const AdminViewContext = createContext<AdminViewInterface | null>(null);

export function AdminViewProvider({ children }: { children: React.ReactNode }) {
  const [listView, setListView] = useState(true);
  const [selectedEntities, setSelectedEntities] = useState<Entity[]>([]);

  return (
    <AdminViewContext.Provider
      value={{ listView, setListView, selectedEntities, setSelectedEntities }}
    >
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
