import Grid, { Grid2Props } from '@mui/material/Unstable_Grid2';
import Category2Card, { Category2CardProps } from './Category2Card';
import Breadcrumbs from 'components/LandingPage/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Category2Sidebar from './Category2Sidebar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import SelfManagedLink from 'components/LandingPage/SelfManagedLink';
import WhatsNew, { WhatsNewProps } from 'components/LandingPage/WhatsNew';
import { LandingPageLayoutProps } from 'pages/LandingPage/LandingPageTypes';
import ReleaseSelector from 'components/LandingPage/ReleaseSelector';
import { usePageData } from 'hooks/usePageData';
import EditPagePropsButton from '../EditPagePropsButton';
import NotLoggedInInfo from 'components/NotLoggedInInfo';

export type Category2LayoutProps = LandingPageLayoutProps & {
  cards: Category2CardProps[];
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

  const variableColor = backgroundProps.backgroundImage
    ? { color: 'white' }
    : { color: 'black' };

  const rowContainerProps: Grid2Props = {
    container: true,
    direction: 'row',
    gap: '56px',
    flexWrap: { xs: 'wrap', sm: 'nowrap' },
  };

  const leftWidth = 300;
  const leftSizing = {
    width: { xs: '100%', sm: leftWidth },
    minWidth: { xs: '100%', sm: leftWidth },
  };

  return (
    <Box sx={backgroundProps}>
      <Stack
        sx={{
          padding: { xs: '1rem', sm: '40px 32px' },
          margin: { xs: 'auto', sm: '0 auto' },
          width: 'fit-content',
        }}
        gap="2rem"
      >
        <Grid {...rowContainerProps}>
          <Grid sx={leftSizing}>
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
          </Grid>
          <Grid>
            <Typography
              variant="h1"
              sx={{ ...variableColor, fontWeight: 600, fontSize: '2em' }}
            >
              Welcome to Guidewire Documentation
            </Typography>
            <Typography
              variant="h2"
              sx={{ ...variableColor, fontSize: '14px', marginTop: '8px' }}
            >
              Find guides, API references, tutorials, and more to help you
              implement, adopt, and use Guidewire applications and services.
            </Typography>
            <NotLoggedInInfo
              styles={{
                ...variableColor,
                fontSize: '14px',
                fontWeight: 600,
              }}
            />
          </Grid>
        </Grid>
        <Grid {...rowContainerProps}>
          <Grid sx={leftSizing}>
            <WhatsNew {...whatsNew} />
            Gr
          </Grid>
          <Stack marginRight="auto" gap="2rem" flexWrap="wrap">
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
          </Stack>
        </Grid>
      </Stack>
    </Box>
  );
}
