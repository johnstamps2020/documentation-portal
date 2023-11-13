import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { LandingPageItemProps } from 'pages/LandingPage/LandingPageTypes';

export interface TabPanelProps {
  index: number;
  value: number;
  items: LandingPageItemProps[];
}

export default function ApplicationLinkList(props: TabPanelProps): JSX.Element {
  const { value, index, items, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`doc-tabpanel-${index}`}
      aria-labelledby={`doc-tab-${index}`}
      {...other}
    >
      <Container>
        <Grid container spacing={4} sx={{ pt: '68px' }}>
          {items.map((item, index) => (
            <Grid xs={12} sm={6} md={4} key={index}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontSize: 21,
                  mb: 1.5,
                  fontWeight: 600,
                }}
              >
                <Link>{item.label}</Link>
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
