import Paper from '@mui/material/Paper';
import { useLandingPageItems } from 'hooks/useLandingPageItems';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import LandingPageLink from 'components/LandingPage/LandingPageLink';
import Skeleton from '@mui/material/Skeleton';

export default function ProductFamilyCard(item: LandingPageItemProps) {
  const sx = {
    fontSize: 20,
    fontWeight: 800,
  };
  const { landingPageItems, isLoading, isError } = useLandingPageItems([item]);

  if (isError) {
    return (
      <Skeleton
        variant="rectangular"
        sx={{
          width: { sm: '300px', xs: '100%' },
          height: '100px',
        }}
      />
    );
  }

  if (isLoading || !landingPageItems) {
    return null;
  }

  return (
    <Paper
      sx={{
        height: '100px',
        width: { xs: '100%', sm: '300px' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LandingPageLink landingPageItem={landingPageItems[0]} sx={sx} />
    </Paper>
  );
}
