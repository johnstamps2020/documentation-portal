import FormGroup from '@mui/material/FormGroup';
import SearchFilterCheckbox from './SearchFilterCheckbox';
import { useSearchData } from 'hooks/useApi';

type SearchFilterCheckboxProps = {
  filterName: string;
};

export default function SearchFilterCheckboxList({
  filterName,
}: SearchFilterCheckboxProps) {
  const { searchData, isError, isLoading } = useSearchData();

  if (!searchData || isLoading || isError) {
    return null;
  }

  const values = searchData.filters.find((f) => f.name === filterName)?.values;

  if (!values) {
    return null;
  }

  // sort by checked first, then by alphabetically
  // if it's "version", reverse the order
  values.sort((a, b) => {
    // if (a.checked && !b.checked) {
    //   return -1;
    // } else if (!a.checked && b.checked) {
    //   return 1;
    // } else {
    return ['version', 'release'].includes(filterName)
      ? b.label.localeCompare(a.label, undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      : a.label.localeCompare(b.label);
    // }
  });

  return (
    <FormGroup sx={{ gap: '8px' }}>
      {values.map((value) => (
        <SearchFilterCheckbox
          key={value.label}
          name={filterName}
          value={value}
        />
      ))}
    </FormGroup>
  );
}
