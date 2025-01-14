import React, { createContext, useContext } from 'react';
import { Entity } from './EntityListWithFilters';
import { MultipleOperationMode } from './EditMultiple/MultipleButton';

interface AdminViewInterface {
  listView: boolean;
  setListView: (value: boolean) => void;
  filters: Entity;
  setFilters: React.Dispatch<React.SetStateAction<Entity>>;
  emptyFilters: Entity;
  page: number;
  setPage: (value: number) => void;
  resultsPerPage: number;
  setResultsPerPage: (value: number) => void;
  filteredEntities: Entity[];
  setFilteredEntities: React.Dispatch<React.SetStateAction<Entity[]>>;
  selectedEntities: Entity[];
  setSelectedEntities: React.Dispatch<React.SetStateAction<Entity[]>>;
  entityDatabaseName: string;
  setEntityDatabaseName: (value: string) => void;
  entityPrimaryKeyName: string;
  setEntityPrimaryKeyName: (value: string) => void;
  EntityFormComponent: React.ElementType;
  mode: MultipleOperationMode | null;
  setMode: React.Dispatch<React.SetStateAction<MultipleOperationMode | null>>;
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
