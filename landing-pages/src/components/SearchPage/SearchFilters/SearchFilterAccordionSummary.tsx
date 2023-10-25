import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { StyledAccordionSummary } from '../StyledSearchComponents';
import { UIFilter } from './SearchFilterPanel';
import { useEffect, useState } from 'react';
import { useSearchData } from 'hooks/useApi';

export type SearchFilterAccordionSummaryProps = {
  label: string;
  filterNames: UIFilter['name'][];
};

export default function SearchFilterAccordionSummary({
  label,
  filterNames,
}: SearchFilterAccordionSummaryProps) {
  const [total, setTotal] = useState(0);
  const [numberOfChecked, setNumberOfChecked] = useState(0);
  const { searchData, isError, isLoading } = useSearchData();

  useEffect(() => {
    if (!searchData || isError || isLoading) {
      return;
    }

    let partialTotal = 0;
    let partialChecked = 0;
    for (const filterName of filterNames) {
      const matchingFilter = searchData.filters.find(
        (searchDataFilter) => searchDataFilter.name === filterName
      );

      if (matchingFilter) {
        partialTotal += matchingFilter.values.length;
        partialChecked += matchingFilter.values.filter(
          (value) => value.checked
        ).length;
      }
    }

    setTotal(partialTotal);
    setNumberOfChecked(partialChecked);
  }, [filterNames, searchData, isError, isLoading]);

  return (
    <StyledAccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="search-filter-panel-content"
      id="search-filter-panel-header"
    >
      {label} ({numberOfChecked}/{total})
    </StyledAccordionSummary>
  );
}
