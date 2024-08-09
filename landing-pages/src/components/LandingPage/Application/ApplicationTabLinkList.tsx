import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import LandingPageLink from 'components/LandingPage/LandingPageLink';
import { getListOfItemsToDisplayOnLandingPage } from 'helpers/landingPageHelpers';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';
import { useLandingPageItemsContext } from '../LandingPageItemsContext';

export interface TabPanelProps {
  index: number;
  value: number;
  items: LandingPageItemProps[];
}

export default function ApplicationTabLinkList(props: TabPanelProps) {
  const { value, index, items, ...other } = props;
  const { allAvailableItems } = useLandingPageItemsContext();

  if (!allAvailableItems) {
    return null;
  }

  const matchingItems = getListOfItemsToDisplayOnLandingPage(
    items,
    allAvailableItems
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
        <Grid container spacing={4} sx={{ pt: '68px' }} className="tabSection">
          {matchingItems.map((item, idx) => (
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
      </Container>
    </div>
  );
}
