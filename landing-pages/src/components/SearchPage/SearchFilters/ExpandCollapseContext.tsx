import { createContext, useContext, useState } from 'react';
import { UIFilter, uiFilters } from './SearchFilterPanel';

type FilterAccordionWithExpandCollapseStatus = {
  filterName: UIFilter['name'];
  expanded: boolean;
};

interface ExpandCollapseContextInterface {
  filterAccordionsWithExpandCollapseStatus: FilterAccordionWithExpandCollapseStatus[];
  setExpandCollapse: (filterName: string, expand: boolean) => void;
  getExpandCollapseStatus: (filterName: string) => boolean;
  setStatusForAllFilters: (expand: boolean) => void;
}

export const ExpandCollapseContext =
  createContext<ExpandCollapseContextInterface | null>(null);

type ExpandCollapseProviderProps = {
  children: React.ReactNode;
};

function getInitialExpandCollapseObjectFromUiFilters(
  filters: UIFilter[]
): FilterAccordionWithExpandCollapseStatus[] {
  const flatFilterStatusList: FilterAccordionWithExpandCollapseStatus[] = [];
  filters.forEach((filter) => {
    if (filter.filters) {
      const subFilterStatusList = getInitialExpandCollapseObjectFromUiFilters(
        filter.filters
      );
      flatFilterStatusList.push(...subFilterStatusList);
    }
    flatFilterStatusList.push({
      filterName: filter.name,
      expanded: true,
    });
  });

  return flatFilterStatusList;
}

export function ExpandCollapseProvider({
  children,
}: ExpandCollapseProviderProps) {
  const initialFilterList =
    getInitialExpandCollapseObjectFromUiFilters(uiFilters);

  const [
    filterAccordionsWithExpandCollapseStatus,
    setFilterAccordionsWithExpandCollapseStatus,
  ] = useState<FilterAccordionWithExpandCollapseStatus[]>(initialFilterList);

  function setStatusForAllFilters(expand: boolean) {
    setFilterAccordionsWithExpandCollapseStatus((existingList) => {
      const newList = existingList.map((filterAccordion) => {
        return {
          ...filterAccordion,
          expanded: expand,
        };
      });
      return newList;
    });
  }

  function setExpandCollapse(filterName: string, expand: boolean) {
    setFilterAccordionsWithExpandCollapseStatus((existingList) => {
      const newList = existingList.map((filterAccordion) => {
        if (filterAccordion.filterName === filterName) {
          return {
            ...filterAccordion,
            expanded: expand,
          };
        }
        return filterAccordion;
      });
      return newList;
    });
  }

  function getExpandCollapseStatus(filterName: string) {
    const filterAccordion = filterAccordionsWithExpandCollapseStatus.find(
      (filterAccordion) => filterAccordion.filterName === filterName
    );
    return filterAccordion?.expanded ?? true;
  }

  return (
    <ExpandCollapseContext.Provider
      value={{
        filterAccordionsWithExpandCollapseStatus,
        setExpandCollapse,
        getExpandCollapseStatus,
        setStatusForAllFilters,
      }}
    >
      {children}
    </ExpandCollapseContext.Provider>
  );
}

export function useExpandCollapseContext() {
  const value = useContext(ExpandCollapseContext);

  if (!value) {
    throw new Error(
      'useExpandCollapseContext must be used within ExpandCollapseProvider'
    );
  }

  return value;
}
