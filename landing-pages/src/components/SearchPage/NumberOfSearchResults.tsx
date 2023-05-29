import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useSearchData } from 'hooks/useApi';

export default function NumberOfSearchResults() {
  const { searchData, isLoading } = useSearchData();

  if (isLoading || !searchData) {
    return (
      <Skeleton
        variant="rectangular"
        sx={{
          width: { sm: '150px', xs: '100%' },
          height: '24px',
          marginTop: '0.3rem',
        }}
      />
    );
  }

  return (
    <Typography paragraph sx={{ padding: 0, margin: 0 }}>
      {`${searchData.totalNumOfResults} ${
        searchData.totalNumOfResults === 1 ? 'result' : 'results'
      }`}
    </Typography>
  );
}
