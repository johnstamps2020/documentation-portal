import FormGroup from '@mui/material/FormGroup';
import { ServerSearchFilterValue } from 'server/dist/types/serverSearch';
import SearchFilterCheckbox from './SearchFilterCheckbox';

type SearchFilterCheckboxProps = {
  filterName: string;
  values: ServerSearchFilterValue[];
};

export default function SearchFilterCheckboxList({
  filterName,
  values,
}: SearchFilterCheckboxProps) {
  // sort by checked first, then by alphabetically
  // if it's "version", reverse the order

  values.sort((a, b) => {
    if (a.checked && !b.checked) {
      return -1;
    } else if (!a.checked && b.checked) {
      return 1;
    } else {
      return ['version', 'release'].includes(filterName)
        ? b.label.localeCompare(a.label, undefined, {
            numeric: true,
            sensitivity: 'base',
          })
        : a.label.localeCompare(b.label);
    }
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
