import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import { Page } from 'server/dist/model/entity/Page';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';

type PageListProps = {
  pages: Page[];
};

export default function PageList({ pages }: PageListProps) {
  return (
    <Grid container spacing={2} sx={{ margin: 2 }}>
      {pages.map(({ path, title }) => (
        <Grid key={path} xs={12} sm={6} md={3}>
          <Card sx={{ padding: 1, height: '100%' }}>
            <CardContent>
              <Typography variant="h2">{title}</Typography>
              <Link
                to={`/${path}`}
                target="_blank"
                component={RouterLink}
                sx={{ textDecoration: 'underline' }}
              >
                <Typography variant="subtitle1" component="div">
                  {path}
                </Typography>
              </Link>
            </CardContent>
            <CardActions>
              <EditButton pagePath={path} />
              <DeleteButton pagePath={path} />
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
