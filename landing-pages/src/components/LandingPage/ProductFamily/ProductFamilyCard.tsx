import Paper from '@mui/material/Paper';
import { useLandingPageItems } from '../../../hooks/useLandingPageItems';
import { LandingPageItemProps } from '../../../pages/LandingPage/LandingPage';
import LandingPageLink from '../LandingPageLink';

export default function ProductFamilyCard(item: LandingPageItemProps) {
  const sx = {
    fontSize: 20,
    fontWeight: 800,
  };
  const { landingPageItems, isLoading, isError } = useLandingPageItems([item]);

  if (isLoading || isError || !landingPageItems) {
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
