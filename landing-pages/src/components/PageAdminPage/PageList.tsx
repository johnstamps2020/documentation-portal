import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { usePages } from 'hooks/useApi';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';

export default function PageList() {
  const { pages, isLoading, isError } = usePages();

  if (isError || isLoading || !pages) {
    return null;
  }
  return (
    <Grid container gap={1}>
      {pages
        .sort((a, b) => {
          const aTitle = a.title.toLowerCase();
          const bTitle = b.title.toLowerCase();
          let result = 0;
          if (aTitle > bTitle) {
            result = 1;
          } else if (aTitle < bTitle) {
            result = -1;
          }
          return result;
        })
        .map(({ path, title }) => (
          <Grid key={path} xs={12} sm={6} md={3}>
            <Card sx={{ padding: 1, height: '100%' }}>
              <CardContent>
                <Typography variant="h2">{title}</Typography>
                <Typography variant="subtitle1" component="div">
                  {path}
                </Typography>
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
