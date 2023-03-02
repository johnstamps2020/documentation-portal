import Grid from '@mui/material/Unstable_Grid2';
import Breadcrumbs from '../Breadcrumbs';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import ProductFamilyCard from './ProductFamilyCard';
import SelfManagedLink from '../SelfManagedLink';
import {
  LandingPageItemProps,
  LandingPageLayoutProps,
} from '../../../pages/LandingPage/LandingPage';
import { usePageData } from '../../../hooks/usePageData';
import ReleaseSelector from '../ReleaseSelector';
import ProductFamilySidebar from './ProductFamilySidebar';

type ProductFamilyLayoutProps = LandingPageLayoutProps & {
  items: LandingPageItemProps[];
};

export default function ProductFamilyLayout({
  backgroundProps,
  items,
  sidebar,
}: ProductFamilyLayoutProps) {
  const { pageData, isError, isLoading } = usePageData();

  if (isError || isLoading || !pageData) {
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
      <Grid>
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
          <ReleaseSelector />
        </Stack>
      </Grid>
      <Grid container width="100%" maxWidth="1330px" gap={2}>
        <Grid container sm={12} md={9} gap={2}>
          {items.map(item => (
            <ProductFamilyCard {...item} key={item.label} />
          ))}
        </Grid>
        {sidebar && <ProductFamilySidebar {...sidebar} />}
      </Grid>
    </Grid>
  );
}
