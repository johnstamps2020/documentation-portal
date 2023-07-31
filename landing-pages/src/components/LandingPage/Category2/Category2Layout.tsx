import Grid from '@mui/material/Unstable_Grid2';
import Category2Card from './Category2Card';
import Breadcrumbs from 'components/LandingPage/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Category2Sidebar from './Category2Sidebar';
import Stack from '@mui/material/Stack';
import SelfManagedLink from 'components/LandingPage/SelfManagedLink';
import WhatsNew, { WhatsNewProps } from 'components/LandingPage/WhatsNew';
import {
  LandingPageItemProps,
  LandingPageLayoutProps,
} from 'pages/LandingPage/LandingPageTypes';
import ReleaseSelector from 'components/LandingPage/ReleaseSelector';
import { usePageData } from 'hooks/usePageData';
import EditPagePropsButton from '../EditPagePropsButton';

export type Category2LayoutProps = LandingPageLayoutProps & {
  cards: {
    label: string;
    items: LandingPageItemProps[];
  }[];
  whatsNew: WhatsNewProps;
  isRelease?: boolean;
};

export default function Category2Layout({
  backgroundProps,
  sidebar,
  cards,
  whatsNew,
  isRelease,
}: Category2LayoutProps) {
  const { pageData, isLoading, isError } = usePageData();

  if (isLoading || isError || !pageData) {
    return null;
  }

  return (
    <Grid
      sx={{
        ...backgroundProps,
        flexWrap: { breakpointsTheme: 'wrap', sm: 'nowrap' },
      }}
      container
      alignContent="center"
      flexDirection="row"
      margin="auto"
      padding="40px 32px"
      gap="56px"
      flexWrap="nowrap"
    >
      <Grid
        container
        flexWrap="wrap"
        height="fit-content"
        width="300px"
        minWidth="300px"
        margin={{ sm: '-30px 0 0 auto', xs: 'auto' }}
      >
        <EditPagePropsButton pagePath={pageData.path} />
        <Stack spacing={1} direction="column" width="100%">
          <Container style={{ padding: 0, margin: '5px 0 0 0' }}>
            <Breadcrumbs />
          </Container>
          {isRelease && <ReleaseSelector />}
        </Stack>
        {isRelease && (
          <SelfManagedLink
            pagePath={pageData.path}
            backgroundImage={backgroundProps.backgroundImage}
          />
        )}
        <WhatsNew {...whatsNew} />
      </Grid>
      <Grid
        container
        direction="column"
        marginRight="auto"
        gap="2rem"
        flexWrap="wrap"
      >
        <Grid marginBottom="16px">
          <Typography
            variant="h1"
            sx={
              backgroundProps.backgroundImage
                ? { color: 'white' }
                : { color: 'black' }
            }
            style={{ fontWeight: 600, fontSize: '2em' }}
          >
            Welcome to Guidewire Documentation
          </Typography>
          <Typography
            variant="h2"
            sx={
              backgroundProps.backgroundImage
                ? { color: 'white' }
                : { color: 'black' }
            }
            style={{ fontSize: '14px', marginTop: '8px' }}
          >
            Find guides, API references, tutorials, and more to help you
            implement, adopt, and use Guidewire applications and services.
          </Typography>
        </Grid>
        <Grid container direction="row" gap="56px">
          <Grid
            container
            maxWidth="600px"
            width="100%"
            xs={9}
            columnGap="24px"
            rowGap="32px"
          >
            {cards.map(
              (card) =>
                card.items.length > 0 && (
                  <Category2Card {...card} key={card.label} />
                )
            )}
          </Grid>
          <Grid sx={{ minHeight: 180, minWidth: 280 }}>
            {sidebar && <Category2Sidebar {...sidebar} />}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
