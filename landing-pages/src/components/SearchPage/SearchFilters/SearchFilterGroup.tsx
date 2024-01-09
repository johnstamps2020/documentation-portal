import SearchFilter from './SearchFilter';
import SearchFilterAccordion from './SearchFilterAccordion';
import SearchFilterAccordionSummary from './SearchFilterAccordionSummary';
import { UIFilter } from './SearchFilterPanel';

export default function SearchFilterGroup({ label, name, filters }: UIFilter) {
  return (
    <SearchFilterAccordion
      label={label}
      name={name}
      summary={
        <SearchFilterAccordionSummary
          label={label}
          filterNames={filters?.map(({ name }) => name) || []}
        />
      }
    >
      {filters?.map((item, idx) => (
        <SearchFilter {...item} key={idx} />
      ))}
    </SearchFilterAccordion>
  );
}
