import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { ServerSearchFilter } from 'server/dist/types/serverSearch';
import SearchFilterCheckboxList from './SearchFilterCheckboxList';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from './StyledSearchComponents';

export type SearchFilterProps = {
  label: string;
  serverSearchFilter: ServerSearchFilter;
  expanded: boolean;
  onChange: (filterName: string, filterIsExpanded: boolean) => void;
};

export default function SearchFilter({
  label,
  serverSearchFilter,
  expanded,
  onChange,
}: SearchFilterProps) {
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
        {label} (
        {serverSearchFilter.values.filter((v) => v.checked).length}/
        {serverSearchFilter.values.length})
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <SearchFilterCheckboxList
          filterName={serverSearchFilter.name}
          values={serverSearchFilter.values}
        />
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
