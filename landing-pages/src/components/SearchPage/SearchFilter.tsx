import FormGroup from '@mui/material/FormGroup';
import { ServerSearchFilter } from 'server/dist/types/serverSearch';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from './StyledSearchComponents';
import SearchFilterCheckbox from './SearchFilterCheckbox';
import SearchFilterCheckboxList from './SearchFilterCheckboxList';

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
        <SearchFilterCheckboxList
          filterName={serverSearchFilter.name}
          values={serverSearchFilter.values}
        />
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
