import React, { createContext, useContext, useState } from 'react';
import { Entity } from './EntityListWithFilters';

interface AdminViewInterface {
  listView: boolean;
  setListView: (value: boolean) => void;
  selectedEntities: Entity[];
  setSelectedEntities: React.Dispatch<React.SetStateAction<Entity[]>>;
  entityDatabaseName: string;
  setEntityDatabaseName: (value: string) => void;
  entityPrimaryKeyName: string;
  setEntityPrimaryKeyName: (value: string) => void;
}

export const AdminViewContext = createContext<AdminViewInterface | null>(null);

export function AdminViewProvider({ children }: { children: React.ReactNode }) {
  const [listView, setListView] = useState(true);
  const [selectedEntities, setSelectedEntities] = useState<Entity[]>([]);
  const [entityDatabaseName, setEntityDatabaseName] = useState('');
  const [entityPrimaryKeyName, setEntityPrimaryKeyName] = useState('');

  return (
    <AdminViewContext.Provider
      value={{
        listView,
        setListView,
        selectedEntities,
        setSelectedEntities,
        entityDatabaseName,
        setEntityDatabaseName,
        entityPrimaryKeyName,
        setEntityPrimaryKeyName,
      }}
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
