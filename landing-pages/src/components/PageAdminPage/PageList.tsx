import Box from '@mui/material/Box';
import { Page } from 'server/dist/model/entity/Page';
import PageCard from './PageCard/PageCard';

type PageListProps = {
  pages: Page[];
};

export default function PageList({ pages }: PageListProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          md: 'repeat(3, 1fr)',
          sm: 'repeat(2, 1fr)',
          xs: '1fr',
        },
        gap: 2,
        py: 6,
      }}
    >
      {pages.map(({ path, title }) => (
        <PageCard path={path} title={title} key={path} />
      ))}
    </Box>
  );
}
