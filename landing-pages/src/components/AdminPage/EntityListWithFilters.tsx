import React, { useEffect, useState } from 'react';
import ActionBar from './ActionBar';
import { AdminViewContext } from './AdminViewContext';
import AdminViewWrapper from './AdminViewWrapper';
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';
import EntityCard from './EntityCard';
import EntityFilters from './EntityFilters';
import EntityListCount from './EntityListCount';
import EntityListPagination from './EntityListPagination';

export type Entity = {
  label: string;
  name?: string;
  url?: string;
  id?: string;
  code?: string;
  [x: string]: string | boolean | any;
};

type AdditionalFilter = {
  filterId: string;
  emptyFilterValue: boolean | string;
  filterFunction: (entity: Entity, filterPhrase?: string) => boolean;
};

type EntityListWithFiltersProps = {
  entities: Entity[];
  entityName: string;
  entityDatabaseName: string;
  entityPrimaryKeyName: string;
  FormComponent: React.ElementType;
  DuplicateButton: React.ElementType;
  EntityCardContents: React.ElementType;
  CardWarning?: React.ElementType;
  additionalFilters?: AdditionalFilter[];
};

function getEmptyFilters(
  entities: Entity[],
  additionalFilters?: AdditionalFilter[]
) {
  const emptyFilters: Entity = {
    label: '',
  };
  const entity = entities[0];
  const { uuid, ...entityNoId } = entity;
  const additionalFilterIds = additionalFilters?.map((additionalFilter) => ({
    [additionalFilter.filterId]: additionalFilter.emptyFilterValue,
  }));
  const entityPropsAndFilters = Object.assign(
    entityNoId,
    ...(additionalFilterIds || [])
  );

  for (const [k, v] of Object.entries(entityPropsAndFilters)) {
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
  DuplicateButton,
  FormComponent,
  EntityCardContents,
  CardWarning,
  additionalFilters,
}: EntityListWithFiltersProps) {
  const emptyFilters = getEmptyFilters(entities, additionalFilters);
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
          const matchingAdditionalFilter = additionalFilters?.find(
            (additionalFilter) => additionalFilter.filterId === k
          );
          if (typeof v === 'boolean') {
            if (v && entity[k as keyof typeof entity] !== v) {
              matchesFilters = false;
            }
            if (v && matchingAdditionalFilter) {
              matchesFilters = !matchingAdditionalFilter.filterFunction(entity);
            }
          } else if (typeof v === 'string') {
            if (
              v !== '' &&
              !entity[k as keyof typeof entity]
                ?.toString()
                ?.toLocaleLowerCase()
                .includes(v.toLocaleLowerCase())
            ) {
              matchesFilters = false;
            }
            if (v !== '' && matchingAdditionalFilter) {
              matchesFilters = !matchingAdditionalFilter.filterFunction(
                entity,
                v
              );
            }
          }
        }
        return matchesFilters;
      });
    }
    const filteredEntities = filterEntities();
    if (filteredEntities) {
      setFilteredEntities(sortEntities(filteredEntities));
    }
  }, [additionalFilters, entities, filters]);

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
          .map((entity, idx) => (
            <EntityCard
              key={idx}
              title={entity.label}
              entity={entity}
              cardContents={<EntityCardContents {...entity} />}
              cardButtons={
                <>
                  <EditButton
                    buttonLabel={`Open ${entityName} editor`}
                    dialogTitle={`Update ${entityName} settings`}
                    formComponent={
                      <FormComponent
                        primaryKey={entity[entityPrimaryKeyName]}
                      />
                    }
                  />
                  <DuplicateButton primaryKey={entity[entityPrimaryKeyName]} />
                  <DeleteButton primaryKey={entity[entityPrimaryKeyName]} />
                </>
              }
              cardWarning={CardWarning && <CardWarning {...entity} />}
            />
          ))}
      </AdminViewWrapper>
    </AdminViewContext.Provider>
  );
}
