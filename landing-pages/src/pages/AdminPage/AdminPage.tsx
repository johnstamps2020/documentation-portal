import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import AdminAccess from '../../components/AdminPage/AdminAccess';
import { useEnvInfo } from '../../hooks/useApi';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { prodDeployEnv } from '../../vars';
import { useLayoutContext } from 'LayoutContext';

type AdminLink = {
  path: string;
  title: string;
};

const links: AdminLink[] = [
  {
    path: '/admin-panel/page',
    title: 'Manage pages',
  },
  {
    path: '/admin-panel/external-link',
    title: 'Manage external links',
  },
  {
    path: '/admin-panel/file-validator',
    title: 'Validate files for pages',
  },
];

export default function AdminPage() {
  const { envInfo, isLoading, isError } = useEnvInfo();
  const navigate = useNavigate();
  const { setTitle } = useLayoutContext();
  const title = 'Admin panel';
  useEffect(() => {
    if (envInfo && envInfo.name === prodDeployEnv) {
      navigate(`/forbidden?unauthorized=/admin-panel`);
    }
  }, [envInfo, navigate]);

  useEffect(() => {
    setTitle(title);
  }, [setTitle]);

  if (isLoading || isError) {
    return null;
  }
  return (
    <AdminAccess pagePath={window.location.href}>
      <Container sx={{ padding: '3rem 0' }}>
        <Typography variant="h1" color="WindowText">
          {title}
        </Typography>
        <Stack spacing={2} direction="row" sx={{ padding: '2rem 0' }}>
          {links.map(({ title, path }) => (
            <Link key={path} component={RouterLink} to={path}>
              <Card sx={{ padding: '2rem 3rem' }} variant="outlined">
                {title}
              </Card>
            </Link>
          ))}
        </Stack>
      </Container>
    </AdminAccess>
  );
}
