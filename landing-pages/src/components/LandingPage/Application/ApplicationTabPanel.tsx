import { LinkSectionProps } from './ApplicationTabs';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Link from '@mui/material/Link';

interface TabPanelProps {
  index: number;
  value: number;
  items: LinkSectionProps[];
}

export default function CustomTabPanel(props: TabPanelProps): JSX.Element {
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
        <Grid container spacing={4} sx={{ pt: '54px' }}>
          {items.map((item, index) => (
            <Grid xs={12} sm={6} md={4} key={index}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontSize: 22,
                  mb: 1.5,
                }}
              >
                <Link>{item.title}</Link>
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
