import Grid from '@mui/material/Unstable_Grid2';
import Breadcrumbs from '../Breadcrumbs';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import SelfManagedLink from '../SelfManagedLink';
import Box from '@mui/material/Box';
import Section, { SectionProps } from './Section';
import { usePageData } from '../../../hooks/usePageData';
import { LandingPageLayoutProps } from '../../../pages/LandingPage/LandingPage';
import LandingPageSelector, {
  LandingPageSelectorProps,
} from '../LandingPageSelector';

export type SectionLayoutProps = LandingPageLayoutProps & {
  sections: SectionProps[];
  selector: LandingPageSelectorProps;
};

export default function SectionLayout({
  sections,
  selector,
}: SectionLayoutProps) {
  const { pageData, isLoading, isError } = usePageData();

  if (isLoading || isError || !pageData) {
    return null;
  }

  return (
    <Grid
      container
      flexDirection="column"
      margin="auto"
      padding="0 20px 64px 20px"
      gap={5}
      alignContent="center"
      sx={{
        minHeight: '100vh',
        backgroundColor: 'hsl(0, 0%, 98%)',
      }}
    >
      <Grid xs={12} lg={8}>
        <Stack spacing={1} direction="column" width="100%">
          <SelfManagedLink pagePath={pageData.path} backgroundImage="" />
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
          {selector && (
            <LandingPageSelector key={selector.label} {...selector} />
          )}
        </Stack>
      </Grid>
      <Box sx={{ columnCount: { xs: 1, md: 2 }, maxWidth: '950px' }}>
        {sections?.map(section => (
          <Section {...section} key={section.label} />
        ))}
      </Box>
    </Grid>
  );
}
