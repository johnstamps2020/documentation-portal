import Grid from '@mui/material/Unstable_Grid2';
import { Page } from 'server/dist/model/entity/Page';
import PageCard from './PageCard/PageCard';

type PageListProps = {
  pages: Page[];
};

export default function PageList({ pages }: PageListProps) {
  return (
    <Grid container spacing={2} sx={{ margin: 2 }}>
      {pages.map(({ path, title }) => (
        <Grid key={path} xs={12} sm={6} md={3}>
          <PageCard path={path} title={title} />
        </Grid>
      ))}
    </Grid>
  );
}
