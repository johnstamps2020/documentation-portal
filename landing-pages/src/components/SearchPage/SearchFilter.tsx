import { ServerSearchFilter } from 'server/dist/types/serverSearch';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useState } from 'react';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from './StyledSearchComponents';
import SearchFilterCheckboxList from './SearchFilterCheckboxList';
import Button from '@mui/material/Button';

type SearchFilterProps = {
  serverSearchFilter: ServerSearchFilter;
  expanded: boolean;
  onChange: (filterName: string, filterIsExpanded: boolean) => void;
};

export default function SearchFilter({
  serverSearchFilter,
  expanded,
  onChange,
}: SearchFilterProps) {
  const [sortAlpha, setSortAlpha] = useState(false);
  function handleAccordionExpandCollapse(
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) {
    onChange(serverSearchFilter.name, isExpanded);
  }

  return (
    <StyledAccordion
      expanded={expanded}
      onChange={handleAccordionExpandCollapse}
    >
      <StyledAccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="search-filter-panel-content"
        id="search-filter-panel-header"
      >
        {serverSearchFilter.name.replace('_', ' ')} (
        {serverSearchFilter.values.filter((v) => v.checked).length}/
        {serverSearchFilter.values.length})
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Button onClick={() => setSortAlpha(!sortAlpha)} sx={{ p: '6px 0px' }}>
          {sortAlpha ? 'Sort by count' : 'Sort alphabetically'}
        </Button>
        <SearchFilterCheckboxList
          filterName={serverSearchFilter.name}
          values={serverSearchFilter.values}
          sortAlphabetically={sortAlpha}
        />
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
