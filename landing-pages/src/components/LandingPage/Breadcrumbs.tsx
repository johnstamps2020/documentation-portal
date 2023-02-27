import Stack from '@mui/material/Stack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { useBreadcrumbs } from '../../hooks/useApi';

export default function Breadcrumbs() {
  const { breadcrumbs, isError, isLoading } = useBreadcrumbs();

  if (isError || isLoading || !breadcrumbs) {
    return null;
  }

  return (
    <Stack direction="row" divider={<ChevronRightIcon />} spacing={1}>
      {breadcrumbs &&
        breadcrumbs.map(({ path, label, id }) => (
          <Link component={RouterLink} to={`/${path}`} key={id}>
            {label}
          </Link>
        ))}
      {!breadcrumbs && <div style={{ height: '24px' }}></div>}
    </Stack>
  );
}
