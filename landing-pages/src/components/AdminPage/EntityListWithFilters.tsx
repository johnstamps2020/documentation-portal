import FileValidationWarning, {
  checkIfFileExists,
} from 'components/EntitiesAdminPage/PageAdminPage/FileValidationWarning';
import React, { useEffect, useState } from 'react';
import ActionBar from './ActionBar';
import { AdminViewContext } from './AdminViewContext';
import AdminViewWrapper from './AdminViewWrapper';
import EditButton from './EditButton';
import EntityCard from './EntityCard';
import EntityFilters from './EntityFilters';
import EntityLink from './EntityLink';
import EntityListCount from './EntityListCount';
import EntityListPagination from './EntityListPagination';

export type Entity = {
  label: string;
  url: string;
  [x: string]: string | boolean | any;
};

type EntityListWithFiltersProps = {
  entities: Entity[];
  entityName: string;
  entityDatabaseName: string;
  entityPrimaryKeyName: string;
  FormComponent: React.ElementType;
  DuplicateButton: React.ElementType;
  DeleteButton: React.ElementType;
};

function getEmptyFilters(entities: Entity[], entityName: string) {
  const emptyFilters: Entity = {
    label: '',
    url: '',
  };
  const entity = entities[0];
  let { uuid, ...entityNoId } = entity;
  if (entityName === 'page') {
    const missingFileInLandingPages = false;
    entityNoId = { ...entityNoId, missingFileInLandingPages };
  }
  for (const [k, v] of Object.entries(entityNoId)) {
    if (typeof v === 'boolean') {
      emptyFilters[k] = false;
    }

    if (typeof v === 'string') {
      emptyFilters[k] = '';
    }
  }
  return emptyFilters;
}

function sortEntities(entities: Entity[]) {
  return entities.sort((a, b) => {
    const aTitle = a.label.toLowerCase();
    const bTitle = b.label.toLowerCase();
    let result = 0;
    if (aTitle > bTitle) {
      result = 1;
    } else if (aTitle < bTitle) {
      result = -1;
    }
    return result;
  });
}

export default function EntityListWithFilters({
  entities,
  entityName,
  entityDatabaseName: initialEntityDatabaseName,
  entityPrimaryKeyName: initialEntityPrimaryKeyName,
  DeleteButton,
  DuplicateButton,
  FormComponent,
}: EntityListWithFiltersProps) {
  const emptyFilters = getEmptyFilters(entities, entityName);
  const [filters, setFilters] = useState<Entity>(emptyFilters);

  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(12);
  const [listView, setListView] = useState(true);
  const [selectedEntities, setSelectedEntities] = useState<Entity[]>([]);
  const [filteredEntities, setFilteredEntities] = useState<Entity[]>(entities);
  const [entityDatabaseName, setEntityDatabaseName] = useState(
    initialEntityDatabaseName
  );
  const [entityPrimaryKeyName, setEntityPrimaryKeyName] = useState(
    initialEntityPrimaryKeyName
  );

  useEffect(() => {
    function filterEntities() {
      return entities?.filter((entity) => {
        let matchesFilters = true;
        for (const [k, v] of Object.entries(filters)) {
          if (typeof v === 'boolean') {
            if (v && entity[k as keyof typeof entity] !== v) {
              matchesFilters = false;
            }
            if (
              k === 'missingFileInLandingPages' &&
              v &&
              !checkIfFileExists(entity.url)
            ) {
              matchesFilters = true;
            }
          } else if (
            typeof v === 'string' &&
            v !== '' &&
            !entity[k as keyof typeof entity]
              ?.toString()
              ?.toLocaleLowerCase()
              .includes(v.toLocaleLowerCase())
          ) {
            matchesFilters = false;
          }
        }
        return matchesFilters;
      });
    }
    const filteredEntities = filterEntities();
    if (filteredEntities) {
      setFilteredEntities(sortEntities(filteredEntities));
    }
  }, [entities, filters]);

  const resultsOffset = page === 1 ? 0 : (page - 1) * resultsPerPage;

  return (
    <AdminViewContext.Provider
      value={{
        listView,
        setListView,
        filters,
        setFilters,
        emptyFilters,
        page,
        setPage,
        resultsPerPage,
        setResultsPerPage,
        filteredEntities,
        setFilteredEntities,
        selectedEntities,
        setSelectedEntities,
        entityDatabaseName,
        setEntityDatabaseName,
        entityPrimaryKeyName,
        setEntityPrimaryKeyName,
      }}
    >
      <EntityFilters />
      <EntityListCount totalEntities={entities.length} />
      <EntityListPagination />
      <ActionBar />
      <AdminViewWrapper>
        {filteredEntities
          .slice(resultsOffset, resultsOffset + resultsPerPage)
          .map(({ label, url, ...rest }) => (
            <EntityCard
              key={`${label}_${url}`}
              entity={{ label, url, ...rest }}
              title={label}
              cardContents={<EntityLink url={url} label={url} />}
              cardButtons={
                <>
                  <EditButton
                    buttonLabel={`Open ${entityName} editor`}
                    dialogTitle={`Update ${entityName} settings`}
                    formComponent={<FormComponent primaryKey={url} />}
                  />
                  <DuplicateButton primaryKey={url} />
                  <DeleteButton primaryKey={url} />
                </>
              }
              cardWarning={<FileValidationWarning path={url} />}
            />
          ))}
      </AdminViewWrapper>
    </AdminViewContext.Provider>
  );
}
