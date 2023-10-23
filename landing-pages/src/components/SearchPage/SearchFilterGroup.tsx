import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import SearchFilter, { SearchFilterProps } from './SearchFilter';
import { UIFilter } from './SearchFilterPanel';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from './StyledSearchComponents';
import { SearchData } from 'server/dist/types/serverSearch';

type SearchFilterGroupProps = {
  label: string;
  name: string;
  expanded: boolean;
  onChange: (filterName: string, filterIsExpanded: boolean) => void;
  items: UIFilter[];
  searchData: SearchData;
  onExpandCollapse: (filterName: UIFilter['name']) => boolean;
};

export default function SearchFilterGroup({
  label,
  name,
  expanded,
  onChange,
  items,
  searchData,
  onExpandCollapse,
}: SearchFilterGroupProps) {
  function handleAccordionExpandCollapse(
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) {
    onChange(name, isExpanded);
  }

  const itemsToDisplay: SearchFilterProps[] = [];

  items.forEach((gf) => {
    const serverSearchFilter = searchData.filters.find(
      (sf) => sf.name === gf.name
    );

    if (serverSearchFilter) {
      itemsToDisplay.push({
        label: gf.label,
        serverSearchFilter,
        expanded: onExpandCollapse(gf.name),
        onChange,
      });
    }
  });

  if (!itemsToDisplay || itemsToDisplay.length === 0) {
    return null;
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
        {
          itemsToDisplay
            .map((item) => item.serverSearchFilter.values)
            .flat()
            .filter((v) => v.checked).length
        }
        /
        {
          itemsToDisplay.map((item) => item.serverSearchFilter.values).flat()
            .length
        }
        )
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        {itemsToDisplay.map((item, idx) => (
          <SearchFilter {...item} key={idx} />
        ))}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
}
