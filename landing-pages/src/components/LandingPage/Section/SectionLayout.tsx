import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Breadcrumbs from 'components/LandingPage/Breadcrumbs';
import LandingPageSelector, {
  LandingPageSelectorProps,
} from 'components/LandingPage/LandingPageSelector';
import { mainHeight } from 'components/Layout/Layout';
import NotLoggedInInfo from 'components/NotLoggedInInfo';
import { usePageData } from 'hooks/usePageData';
import { LandingPageLayoutProps } from 'pages/LandingPage/LandingPageTypes';
import EditPagePropsButton from '../EditPagePropsButton';
import Section, { SectionProps } from './Section';
import { useLandingPageItemsImmutable } from '../../../hooks/useLandingPageItemsImmutable';
import { LandingPageItemsProvider } from '../LandingPageItemsContext';

export type SectionLayoutProps = LandingPageLayoutProps & {
  sections: SectionProps[];
  selector?: LandingPageSelectorProps;
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
        <EditPagePropsButton pagePath={pageData.path} />
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
              <LandingPageSelector
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
  );
}
