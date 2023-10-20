import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from './StyledSearchComponents';

type SearchFilterGroupProps = {
  label: string;
  name: string;
  expanded: boolean;
  onChange: (filterName: string, filterIsExpanded: boolean) => void;
  children: React.ReactNode;
};

export default function SearchFilterGroup({
  label,
  expanded,
  onChange,
  children,
}: SearchFilterGroupProps) {
  function handleAccordionExpandCollapse(
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) {
    onChange(label, isExpanded);
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
        {label}
      </StyledAccordionSummary>
      <StyledAccordionDetails>{children}</StyledAccordionDetails>
    </StyledAccordion>
  );
}
