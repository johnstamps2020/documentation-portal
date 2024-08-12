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
import CategorySidebar from './CategorySidebar';
import LandingPageSelectorInContext, {
  LandingPageSelectorInContextProps,
} from '../LandingPageSelectorInContext';
import EditPagePropsButton from '../EditPagePropsButton';
import NotLoggedInInfo from 'components/NotLoggedInInfo';
import { LandingPageItemsProvider } from '../LandingPageItemsContext';
import { useLandingPageItemsImmutable } from '../../../hooks/useLandingPageItemsImmutable';

export type CategoryLayoutProps = LandingPageLayoutProps & {
  cards: CategoryCardProps[];
  selector?: LandingPageSelectorInContextProps;
  isRelease?: boolean;
  description?: JSX.Element;
};

export default function CategoryLayout({
  backgroundProps,
  cards,
  sidebar,
  isRelease,
  selector,
  description,
}: CategoryLayoutProps) {
  const selectorItems = selector?.items || [];
  const sidebarItems = sidebar?.items || [];
  const cardItems = cards.map((card) => card.items || []).flat();
  const cardSections = cards.map((card) => card.sections || []).flat();
  const sectionItems = cardSections
    .map((cardSection) => cardSection.items)
    .flat();
  const allPageItems = [
    ...selectorItems,
    ...sidebarItems,
    ...cardItems,
    ...sectionItems,
  ];
  const { pageData } = usePageData();
  const { landingPageItems } = useLandingPageItemsImmutable(allPageItems);

  if (!pageData || !landingPageItems) {
    return null;
  }

  const variableColor = backgroundProps.backgroundImage
    ? { color: 'white' }
    : { color: 'black' };

  return (
    <LandingPageItemsProvider allAvailableItems={landingPageItems}>
      <Grid
        sx={{
          ...backgroundProps,
        }}
        container
        flexDirection="column"
        margin="auto"
        py={5}
        px={1}
        gap={5}
        alignContent="center"
      >
        <EditPagePropsButton pagePath={pageData.path} />
        <Grid gap="2rem">
          <Stack gap={1} direction="column" width="100%">
            {(isRelease || pageData.path === 'selfManagedProducts') && (
              <SelfManagedLink
                pagePath={pageData.path}
                backgroundImage={backgroundProps.backgroundImage}
              />
            )}
            <Container
              style={{
                padding: 0,
                margin: '5px 0 0 0',
              }}
            >
              <Breadcrumbs />
            </Container>
            <Typography
              variant="h1"
              sx={{ ...variableColor, fontSize: '32px' }}
            >
              {pageData.title}
            </Typography>
            {description}
            <NotLoggedInInfo
              styles={{ color: variableColor, borderColor: '#B2B5BD' }}
            />
            {selector && (
              <LandingPageSelectorInContext
                {...selector}
                sx={{ width: '300px' }}
              />
            )}
          </Stack>
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
            {cards.map((card, idx) => (
              <CategoryCard {...card} key={idx} />
            ))}
          </Grid>
          {sidebar && <CategorySidebar {...sidebar} />}
        </Grid>
      </Grid>
    </LandingPageItemsProvider>
  );
}
