import {
  StyledAccordion,
  StyledAccordionDetails,
} from '../StyledSearchComponents';
import { useExpandCollapseContext } from './ExpandCollapseContext';
import { UIFilter } from './SearchFilterPanel';

type SearchFilterAccordionProps = UIFilter & {
  summary: React.ReactNode;
  children: React.ReactNode;
};

export default function SearchFilterAccordion({
  children,
  name,
  summary,
}: SearchFilterAccordionProps) {
  const { setExpandCollapse, getExpandCollapseStatus } =
    useExpandCollapseContext();

  function handleAccordionExpandCollapse(
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) {
    setExpandCollapse(name, isExpanded);
  }

  const expanded = getExpandCollapseStatus(name);

  return (
    <StyledAccordion
      expanded={expanded}
      onChange={handleAccordionExpandCollapse}
    >
      {summary}
      <StyledAccordionDetails>{children}</StyledAccordionDetails>
    </StyledAccordion>
  );
}
