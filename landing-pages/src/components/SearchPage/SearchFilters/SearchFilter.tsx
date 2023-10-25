import SearchFilterAccordion from './SearchFilterAccordion';
import SearchFilterAccordionSummary from './SearchFilterAccordionSummary';
import SearchFilterCheckboxList from './SearchFilterCheckboxList';
import { UIFilter } from './SearchFilterPanel';

export default function SearchFilter({ label, name }: UIFilter) {
  return (
    <SearchFilterAccordion
      name={name}
      label={label}
      summary={
        <SearchFilterAccordionSummary label={label} filterNames={[name]} />
      }
    >
      <SearchFilterCheckboxList filterName={name} />
    </SearchFilterAccordion>
  );
}
