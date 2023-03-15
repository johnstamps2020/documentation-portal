import Grid from '@mui/material/Unstable_Grid2';
import CategoryCard, { CategoryCardProps } from './CategoryCard';
import Breadcrumbs from 'components/LandingPage/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import SelfManagedLink from 'components/LandingPage/SelfManagedLink';
import Paper from '@mui/material/Paper';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import { usePageData } from 'hooks/usePageData';
import { LandingPageLayoutProps } from 'pages/LandingPage/LandingPageTypes';
import ReleaseSelector from 'components/LandingPage/ReleaseSelector';
import CategorySidebar from './CategorySidebar';
import LandingPageSelector, {
  LandingPageSelectorProps,
} from 'components/LandingPage/LandingPageSelector';

export type CategoryLayoutProps = LandingPageLayoutProps & {
  cards: CategoryCardProps[];
  selector?: LandingPageSelectorProps;
  showReleaseSelector?: boolean;
  description?: JSX.Element;
};

export default function CategoryLayout({
  backgroundProps,
  cards,
  sidebar,
  showReleaseSelector,
  selector,
  description,
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
          {description}
          {showReleaseSelector && !selector && <ReleaseSelector />}
          {selector && <LandingPageSelector {...selector} />}
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
          {cards.map((card) => (
            <CategoryCard {...card} key={card.label} />
          ))}
        </Grid>
        {sidebar && <CategorySidebar {...sidebar} />}
      </Grid>
    </Grid>
  );
}
