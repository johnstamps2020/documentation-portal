import ButtonGroup from '@mui/material/ButtonGroup';
import { StyledButton } from '../StyledSearchComponents';
import ClearFilterButton from '../ClearFiltersButton';
import { useExpandCollapseContext } from './ExpandCollapseContext';

export default function SearchFilterPanelButtons() {
  const { setStatusForAllFilters, filterAccordionsWithExpandCollapseStatus } =
    useExpandCollapseContext();
  return (
    <ButtonGroup
      size="small"
      variant="text"
      aria-label="text small button group"
      sx={{
        justifyContent: 'space-between',
        gap: '6px',
        width: '100%',
        marginBottom: '8px',
      }}
    >
      <StyledButton
        onClick={() => setStatusForAllFilters(true)}
        disabled={filterAccordionsWithExpandCollapseStatus.every(
          (f) => f.expanded
        )}
      >
        Expand all
      </StyledButton>
      <StyledButton
        onClick={() => setStatusForAllFilters(false)}
        disabled={filterAccordionsWithExpandCollapseStatus.every(
          (f) => !f.expanded
        )}
      >
        Collapse all
      </StyledButton>
      <ClearFilterButton label="Clear filters" grouped={true} />
    </ButtonGroup>
  );
}
