import SearchBox from './SearchBox/SearchBox';
import { SearchHeaderLayoutContextProvider } from './SearchDropdown/SearchHeaderLayoutContext';
import SearchHeaderButton from './SearchDropdown/SearchHeaderButton';

export default function SearchHeadWrapper() {
  return (
    <>
      <SearchHeaderLayoutContextProvider>
        <SearchHeaderButton />
      </SearchHeaderLayoutContextProvider>
      <SearchBox big={false} />
    </>
  );
}
