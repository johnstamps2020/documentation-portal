import { useSearchData } from 'hooks/useApi';
import SearchResult from './SearchResult';
import ResultsSkeleton from './ResultsSkeleton';

export default function SearchResultList() {
  const { searchData, isLoading } = useSearchData();

  if (isLoading || !searchData) {
    return <ResultsSkeleton />;
  }

  return (
    <>
      {searchData.searchResults.map((r, index) => (
        <SearchResult key={`${r.title.toLowerCase()}${index}`} {...r} />
      ))}
    </>
  );
}
