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
    query.delete('page');
    navigate({
      pathname: `${location.pathname}`,
      search: query && `?${query.toString()}`,
    });
  }

  return { modifyFilterValue };
}
