import { navigateWithUpdatedParams } from '@doctools/core';

export function useQueryParameters() {
  const query = new URLSearchParams(window.location.search);

  function modifyFilterValue(
    filterName: string,
    filterValue: string,
    add: boolean = true
  ) {
    const filterValues = query.get(filterName)?.split(',') || [];

    if (add) {
      filterValues.push(filterValue);
    } else {
      filterValues.splice(filterValues.indexOf(filterValue), 1);
    }

    const onlyNonEmptyFilterValues = filterValues.filter(Boolean);
    onlyNonEmptyFilterValues.length > 0
      ? query.set(filterName, onlyNonEmptyFilterValues.join(','))
      : query.delete(filterName);

    query.delete('page');
    navigateWithUpdatedParams(query);
  }

  return { modifyFilterValue };
}
