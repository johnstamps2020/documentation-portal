import Pagination from '@mui/material/Pagination';
import { useDeltaDocContext } from './DeltaDocContext';

type DeltaDocResultPaginationProps = {
  count: number;
};

export default function DeltaDocResultPagination({
  count,
}: DeltaDocResultPaginationProps) {
  const { changePage, page } = useDeltaDocContext();

  return (
    <Pagination
      sx={{ alignSelf: 'center', margin: '16px 0' }}
      color="primary"
      count={count}
      page={page}
      onChange={(event, page) => changePage(page)}
    />
  );
}
