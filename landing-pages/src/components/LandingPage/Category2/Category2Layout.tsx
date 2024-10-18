import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid, { Grid2Props } from '@mui/material/Unstable_Grid2';
import Breadcrumbs from 'components/LandingPage/Breadcrumbs';
import {
  LandingPageItemProps,
  LandingPageLayoutProps,
} from 'components/LandingPage/LandingPageTypes';
import SelfManagedLink from 'components/LandingPage/SelfManagedLink';
import WhatsNew, { WhatsNewProps } from 'components/LandingPage/WhatsNew';
import WhatsNext, { WhatsNextProps } from 'components/LandingPage/WhatsNext';
import NotLoggedInInfo from 'components/NotLoggedInInfo';
import { useLandingPageItemsImmutable } from 'hooks/useLandingPageItemsImmutable';
import { usePageData } from 'hooks/usePageData';
import AdminControls from '../AdminControls';
import { LandingPageItemsProvider } from '../LandingPageItemsContext';
import LandingPageLayout from '../LandingPageLayout';
import LandingPageSelectorInContext, {
  LandingPageSelectorInContextProps,
} from '../LandingPageSelectorInContext';
import Category2Card, { Category2CardProps } from './Category2Card';
import Category2Sidebar from './Category2Sidebar';

export type Category2LayoutProps = LandingPageLayoutProps & {
  cards: Category2CardProps[];
  headerText?: string;
  subHeaderText?: string;
  selector?: LandingPageSelectorInContextProps;
  whatsNext?: WhatsNextProps;
  whatsNew?: WhatsNewProps;
  isRelease?: boolean;
};

export default function Category2Layout({
  backgroundProps,
  headerText,
  subHeaderText,
  sidebar,
  cards,
  selector,
  whatsNext,
  whatsNew,
  isRelease,
}: Category2LayoutProps) {
  const headText = headerText || 'Welcome to Guidewire Documentation';
  const subHeadText =
    subHeaderText ||
    'Find guides, API references, tutorials, and more to help you implement, adopt, and use Guidewire applications and services.';

  const selectorItems = selector?.items || [];
  const sidebarItems = sidebar?.items || [];
  const cardItems = cards.map((card) => card.items).flat();
  const allPageItems = [
    ...cardItems,
    whatsNext?.item,
    whatsNew?.item,
    ...selectorItems,
    ...sidebarItems,
  ].filter((item): item is LandingPageItemProps => item !== undefined);

  const { pageData } = usePageData();
  const { landingPageItems } = useLandingPageItemsImmutable(allPageItems);

  if (!pageData || !landingPageItems) {
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
    <LandingPageLayout>
      <LandingPageItemsProvider allAvailableItems={landingPageItems}>
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
                <AdminControls />
                <Stack gap={1} direction="column" width="100%">
                  <Container style={{ padding: 0, margin: '5px 0 0 0' }}>
                    <Breadcrumbs />
                  </Container>
                  {selector && (
                    <LandingPageSelectorInContext
                      {...selector}
                      sx={{ width: '300px !important' }}
                    />
                  )}
                </Stack>
                {isRelease && (
                  <SelfManagedLink
                    pagePath={pageData.path}
                    backgroundImage={backgroundProps.backgroundImage}
                  />
                )}
              </Grid>
              <Grid
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                <Typography
                  variant="h1"
                  sx={{ ...variableColor, fontWeight: 600, fontSize: '2em' }}
                >
                  {headText}
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    ...variableColor,
                    fontSize: '14px',
                    marginTop: '8px',
                    maxWidth: '105ch',
                  }}
                >
                  {subHeadText}
                </Typography>
                <NotLoggedInInfo
                  styles={{
                    color: variableColor,
                    borderColor: '#B2B5BD',
                    fontSize: '18px',
                    fontWeight: 400,
                  }}
                />
              </Grid>
            </Grid>
            <Grid {...rowContainerProps}>
              <Grid container sx={{ ...leftSizing, gap: '32px' }}>
                {whatsNext && <WhatsNext {...whatsNext} />}
                {whatsNew && <WhatsNew {...whatsNew} />}
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
      </LandingPageItemsProvider>
    </LandingPageLayout>
  );
}
