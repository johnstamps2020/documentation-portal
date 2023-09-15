import { Button } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import { useEffect, useState } from 'react';
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
  const sliceLimit = 5;
  const [aboveTheLineValues, setAboveTheLineValues] = useState<
    ServerSearchFilterValue[]
  >([]);
  const [expanded, setExpanded] = useState<boolean>(false);

  // sort by checked first, then by alphabetically
  // if it's "version", reverse the order
  values.sort((a, b) => {
    if (a.checked && !b.checked) {
      return -1;
    } else if (!a.checked && b.checked) {
      return 1;
    } else {
      return (
        a.label.localeCompare(b.label) * (filterName === 'version' ? -1 : 1)
      );
    }
  });

  useEffect(() => {
    // if there are no checked values, show the first 5
    // if there are checked values, show all checked values
    const numberOfCheckedValues = values.filter(
      (value) => value.checked
    ).length;
    const slice = expanded
      ? values
      : values.slice(
          0,
          numberOfCheckedValues > sliceLimit
            ? numberOfCheckedValues
            : sliceLimit
        );

    setAboveTheLineValues(
      slice.filter((value) => value.doc_count > 0 || value.checked)
    );
  }, [values, expanded]);

  function toggleExpanded() {
    setExpanded(!expanded);
  }

  return (
    <FormGroup sx={{ gap: '8px' }}>
      {aboveTheLineValues.map((value) => (
        <SearchFilterCheckbox
          key={value.label}
          name={filterName}
          value={value}
        />
      ))}
      {values.length > sliceLimit && (
        <Button onClick={toggleExpanded}>
          {expanded ? 'Show less' : 'Show more'}
        </Button>
      )}
    </FormGroup>
  );
}
