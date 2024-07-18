import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import LandingPageItemRenderer from 'components/LandingPage/LandingPageItemRenderer';
import LandingPageLink from 'components/LandingPage/LandingPageLink';
import { arrangeItems } from 'helpers/landingPageHelpers';
import { useLandingPageItems } from 'hooks/useLandingPageItems';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';

export interface TabPanelProps {
  index: number;
  value: number;
  items: LandingPageItemProps[];
}

export default function ApplicationTabLinkList(
  props: TabPanelProps
): JSX.Element {
  const { value, index, items, ...other } = props;
  const { isError, isLoading, landingPageItems } = useLandingPageItems(items);
  const arrangedItems = arrangeItems(items, landingPageItems, true);

  const tabItemContents = (
    <Grid container spacing={4} sx={{ pt: '68px' }} className="tabSection">
      {arrangedItems.map((item, idx) => (
        <Grid xs={12} sm={6} md={4} key={idx}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontSize: 21,
              mb: 1.5,
              fontWeight: 600,
            }}
          >
            <LandingPageLink landingPageItem={item} />
          </Typography>
          <Typography variant="body1" component="p">
            {item.description}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`doc-tabpanel-${index}`}
      aria-labelledby={`doc-tab-${index}`}
      {...other}
    >
      <Container>
        <LandingPageItemRenderer
          isError={isError}
          isLoading={isLoading}
          landingPageItems={landingPageItems}
          skeleton={<Skeleton variant="rectangular" sx={{ height: '300px' }} />}
          item={tabItemContents}
        />
      </Container>
    </div>
  );
}
