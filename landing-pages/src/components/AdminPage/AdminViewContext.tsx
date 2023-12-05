import React, { createContext, useContext } from 'react';
import { Entity } from './EntityListWithFilters';

interface AdminViewInterface {
  listView: boolean;
  setListView: (value: boolean) => void;
  filteredEntities: Entity[];
  setFilteredEntities: React.Dispatch<React.SetStateAction<Entity[]>>;
  selectedEntities: Entity[];
  setSelectedEntities: React.Dispatch<React.SetStateAction<Entity[]>>;
  entityDatabaseName: string;
  setEntityDatabaseName: (value: string) => void;
  entityPrimaryKeyName: string;
  setEntityPrimaryKeyName: (value: string) => void;
}

export const AdminViewContext = createContext<AdminViewInterface | null>(null);

export function useAdminViewContext() {
  const context = useContext(AdminViewContext);

  if (!context) {
    throw new Error(
      'useAdminViewContext must be used within a AdminViewProvider'
    );
  }

  return context;
}
