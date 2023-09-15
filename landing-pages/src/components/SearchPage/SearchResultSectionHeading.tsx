import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useSearchData } from 'hooks/useApi';

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
    <Typography
      sx={{
        fontSize: { xs: 26, sm: 32 },
        textAlign: 'left',
        color: 'black',
        fontWeight: 600,
        lineHeight: 'normal',
      }}
    >
      {searchData.totalNumOfResults.toLocaleString()}{' '}
      {searchData.totalNumOfCollapsedResults === 1 ? 'result' : 'results'} for "
      {searchData.searchPhrase}"
    </Typography>
  );
}
