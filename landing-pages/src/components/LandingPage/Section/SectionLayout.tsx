import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Breadcrumbs from 'components/LandingPage/Breadcrumbs';
import { LandingPageLayoutProps } from 'components/LandingPage/LandingPageTypes';
import { mainHeight } from 'components/Layout/Layout';
import NotLoggedInInfo from 'components/NotLoggedInInfo';
import { usePageData } from 'hooks/usePageData';
import { useLandingPageItemsImmutable } from '../../../hooks/useLandingPageItemsImmutable';
import AdminControls from '../AdminControls';
import { LandingPageItemsProvider } from '../LandingPageItemsContext';
import LandingPageLayout from '../LandingPageLayout';
import LandingPageSelectorInContext, {
  LandingPageSelectorInContextProps,
} from '../LandingPageSelectorInContext';
import Section, { SectionProps } from './Section';

export type SectionLayoutProps = LandingPageLayoutProps & {
  sections: SectionProps[];
  selector?: LandingPageSelectorInContextProps;
};

export default function SectionLayout({
  sections,
  selector,
}: SectionLayoutProps) {
  const selectorItems = selector?.items || [];
  const sectionItems = sections.map((section) => section.items).flat();
  const allPageItems = [...selectorItems, ...sectionItems];
  const { pageData } = usePageData();
  const { landingPageItems } = useLandingPageItemsImmutable(allPageItems);

  if (!pageData || !landingPageItems) {
    return null;
  }

  return (
    <LandingPageLayout>
      <LandingPageItemsProvider allAvailableItems={landingPageItems}>
        <Grid
          container
          flexDirection="column"
          margin="auto"
          py={5}
          px={1}
          gap={5}
          alignContent="center"
          sx={{
            minHeight: mainHeight,
            backgroundColor: 'hsl(0, 0%, 98%)',
          }}
        >
          <AdminControls />
          <Grid xs={12} lg={8}>
            <Stack gap={1} direction="column" width="100%">
              <Container style={{ padding: 0, margin: '5px 0 0 0' }}>
                <Breadcrumbs />
              </Container>
              <Typography
                sx={{
                  fontSize: '2em',
                  textAlign: 'left',
                  color: 'black',
                  fontWeight: 600,
                  marginTop: 0,
                }}
              >
                {pageData.title}
              </Typography>
              <NotLoggedInInfo />
              {selector && (
                <LandingPageSelectorInContext
                  key={selector.label}
                  {...selector}
                  sx={{ width: '300px' }}
                />
              )}
            </Stack>
          </Grid>
          <Box sx={{ columnCount: { xs: 1, md: 2 }, maxWidth: '950px' }}>
            {sections?.map((section) => (
              <Section {...section} key={section.label} />
            ))}
          </Box>
        </Grid>
      </LandingPageItemsProvider>
    </LandingPageLayout>
  );
}
