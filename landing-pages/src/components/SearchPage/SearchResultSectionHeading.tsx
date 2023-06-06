import { useSearchData } from 'hooks/useApi';
import { StyledHeading1 } from './StyledSearchComponents';
import Skeleton from '@mui/material/Skeleton';

export default function SearchResultSectionHeading() {
  const { searchData, isLoading } = useSearchData();

  if (isLoading || !searchData) {
    return (
      <Skeleton
        variant="rectangular"
        sx={{
          width: { sm: '700px', xs: '100%' },
          height: '60px',
          marginRight: '20px',
        }}
      />
    );
  }

  return (
    <StyledHeading1>
      {searchData.totalNumOfResults.toLocaleString()}{' '}
      {searchData.totalNumOfCollapsedResults === 1 ? 'result' : 'results'} for "
      {searchData.searchPhrase}"
    </StyledHeading1>
  );
}
