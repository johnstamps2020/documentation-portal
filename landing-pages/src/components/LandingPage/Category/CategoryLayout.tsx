import Grid from '@mui/material/Unstable_Grid2';
import CategoryCard, { CategoryCardProps } from './CategoryCard';
import Breadcrumbs from '../Breadcrumbs';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import SelfManagedLink from '../SelfManagedLink';
import Paper from '@mui/material/Paper';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import { usePageData } from '../../../hooks/usePageData';
import { LandingPageLayoutProps } from '../../../pages/LandingPage/LandingPage';
import ReleaseSelector from '../ReleaseSelector';
import CategorySidebar from './CategorySidebar';
import Box from '@mui/material/Box';

export type CategoryLayoutProps = LandingPageLayoutProps & {
  cards: CategoryCardProps[];
  showReleaseSelector?: boolean;
  selfManaged?: boolean;
};

export default function CategoryLayout({
  backgroundProps,
  cards,
  sidebar,
  showReleaseSelector = true,
  selfManaged = false,
}: CategoryLayoutProps) {
  const { pageData, isLoading, isError } = usePageData();

  if (isLoading || isError || !pageData) {
    return null;
  }

  return (
    <Grid
      sx={{ ...backgroundProps }}
      container
      flexDirection="column"
      margin="auto"
      padding="0 20px 64px 20px"
      gap={5}
      alignContent="center"
    >
      <Grid gap="2rem">
        <Stack spacing={1} direction="column" width="100%">
          <SelfManagedLink
            pagePath={pageData.path}
            backgroundImage={backgroundProps.backgroundImage}
          />
          <Container style={{ padding: 0, margin: '5px 0 0 0' }}>
            <Breadcrumbs />
          </Container>
          <Typography
            variant="h1"
            sx={
              backgroundProps.backgroundImage
                ? { color: 'white' }
                : { color: 'black' }
            }
          >
            {pageData.title}
          </Typography>
          {selfManaged && (
            <Box padding="1rem 1rem 0rem 1rem">
              <Typography variant="body1" lineHeight={2}>
                Find documentation for the latest releases of Guidewire
                self-managed products.
              </Typography>
              <Typography variant="body1" lineHeight={2}>
                Access earlier releases by clicking a product and then selecting
                a version from the <b>Select release</b> dropdown menu.
              </Typography>
            </Box>
          )}
          {showReleaseSelector && <ReleaseSelector />}
        </Stack>
        {pageData.path.includes('cloudProducts/elysian') && (
          <Paper
            sx={{
              maxWidth: { md: '932px', sm: '100%' },
              marginTop: '32px',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <Link
              component={RouterLink}
              to="/cloudProducts/elysian/whatsnew"
              sx={{
                fontSize: '1.2rem',
                fontWeight: 600,
                color: 'hsl(196, 100%, 31%);',
              }}
            >
              What's new in Elysian
            </Link>
          </Paper>
        )}
      </Grid>
      <Grid container maxWidth="1330px" width="100%" gap={6}>
        <Grid
          container
          xs={9}
          gap={2}
          sx={{
            minWidth: { xs: '100%', sm: '616px', md: '932px' },
            maxWidth: '932px',
          }}
        >
          {cards.map(card => (
            <CategoryCard {...card} key={card.label} />
          ))}
        </Grid>
        {sidebar && <CategorySidebar {...sidebar} />}
      </Grid>
    </Grid>
  );
}
