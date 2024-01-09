import { useLocation, useNavigate } from 'react-router-dom';

export function useQueryParameters() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

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

    const addPlatform = (value: string) => {
      const queryPlatform = query.get('platform');
      const existingValues = queryPlatform?.split(',') || [];
      if (!existingValues.includes(value)) {
        existingValues.push(value);
        query.set('platform', existingValues.join(','));
      }
    };

    const removePlatform = (value: string) => {
      const queryPlatform = query.get('platform');
      const existingValues = queryPlatform?.split(',') || [];
      if (existingValues.includes(value)) {
        existingValues.splice(existingValues.indexOf(value), 1);
        if (existingValues.length > 0) {
          query.set('platform', existingValues.join(','));
        } else {
          query.delete('platform');
        }
      }
    };

    if (query.has('version')) {
      addPlatform('Self-managed');
    }

    if (query.has('release')) {
      addPlatform('Cloud');
    }

    if (!query.has('version')) {
      removePlatform('Self-managed');
    }

    if (!query.has('release')) {
      removePlatform('Cloud');
    }

    query.delete('page');
    navigate({
      pathname: `${location.pathname}`,
      search: query && `?${query.toString()}`,
    });
  }

  return { modifyFilterValue };
}
