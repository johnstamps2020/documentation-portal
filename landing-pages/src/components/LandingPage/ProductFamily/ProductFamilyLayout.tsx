import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Breadcrumbs from 'components/LandingPage/Breadcrumbs';
import {
  LandingPageItemProps,
  LandingPageLayoutProps,
} from 'components/LandingPage/LandingPageTypes';
import SelfManagedLink from 'components/LandingPage/SelfManagedLink';
import NotLoggedInInfo from 'components/NotLoggedInInfo';
import { usePageData } from 'hooks/usePageData';
import { useLandingPageItemsImmutable } from '../../../hooks/useLandingPageItemsImmutable';
import AdminControls from '../AdminControls';
import { LandingPageItemsProvider } from '../LandingPageItemsContext';
import LandingPageLayout from '../LandingPageLayout';
import LandingPageSelectorInContext, {
  LandingPageSelectorInContextProps,
} from '../LandingPageSelectorInContext';
import ProductFamilyCard from './ProductFamilyCard';
import ProductFamilySidebar from './ProductFamilySidebar';

export type ProductFamilyLayoutProps = LandingPageLayoutProps & {
  items: LandingPageItemProps[];
  selector?: LandingPageSelectorInContextProps;
  isRelease?: boolean;
};

export default function ProductFamilyLayout({
  backgroundProps,
  items,
  sidebar,
  selector,
  isRelease,
}: ProductFamilyLayoutProps) {
  const selectorItems = selector?.items || [];
  const sidebarItems = sidebar?.items || [];
  const allPageItems = [...selectorItems, ...sidebarItems, ...items];
  const { pageData } = usePageData();
  const { landingPageItems } = useLandingPageItemsImmutable(allPageItems);

  if (!pageData || !landingPageItems) {
    return null;
  }

  const variableColor = backgroundProps.backgroundImage
    ? { color: 'white' }
    : { color: 'black' };

  return (
    <LandingPageLayout>
      <LandingPageItemsProvider allAvailableItems={landingPageItems}>
        <Grid
          sx={{ ...backgroundProps }}
          container
          flexDirection="column"
          margin="auto"
          py={5}
          px={1}
          gap={5}
          alignContent="center"
        >
          <AdminControls />
          <Grid>
            <Stack gap={1} direction="column" width="100%">
              {isRelease && (
                <SelfManagedLink
                  pagePath={pageData.path}
                  backgroundImage={backgroundProps.backgroundImage}
                />
              )}
              <Container style={{ padding: 0, margin: '5px 0 0 0' }}>
                <Breadcrumbs />
              </Container>
              <Typography variant="h1" sx={variableColor}>
                {pageData.title}
              </Typography>
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
          <Grid container width="100%" maxWidth="1330px" gap={2}>
            <Grid container sm={12} md={9} gap={2}>
              {items.map((item) => (
                <ProductFamilyCard {...item} key={item.label} />
              ))}
            </Grid>
            {sidebar && <ProductFamilySidebar {...sidebar} />}
          </Grid>
        </Grid>
      </LandingPageItemsProvider>
    </LandingPageLayout>
  );
}
