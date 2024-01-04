import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import AdminAccess from '../../components/AdminPage/AdminAccess';
import { useEnvInfo } from '../../hooks/useApi';
import { useEffect } from 'react';
import { prodDeployEnv } from '../../vars';
import Divider from '@mui/material/Divider';

type AdminLink = {
  path: string;
  title: string;
};

const links: AdminLink[] = [
  {
    path: 'page',
    title: 'Pages',
  },
  {
    path: 'external-link',
    title: 'External links',
  },
  {
    path: 'source',
    title: 'Sources',
  },
  {
    path: 'resource',
    title: 'Resources',
  },
  {
    path: 'release',
    title: 'Releases',
  },
];

export default function AdminPage() {
  const { envInfo, isLoading, isError } = useEnvInfo();
  const navigate = useNavigate();
  useEffect(() => {
    if (envInfo && envInfo.name === prodDeployEnv) {
      navigate(`/forbidden?unauthorized=/admin-panel`);
    }
  }, [envInfo, navigate]);

  if (isLoading || isError) {
    return null;
  }
  return (
    <AdminAccess pagePath={window.location.href}>
      <Container sx={{ padding: '3rem 0' }}>
        <Stack direction="row" sx={{ pt: '2rem', justifyContent: 'center' }}>
          {links.map(({ title, path }) => (
            <NavLink
              key={path}
              to={path}
              style={({ isActive }) => {
                return {
                  color: isActive ? 'white' : 'black',
                  textDecoration: 'none',
                  backgroundColor: isActive ? 'black' : 'transparent',
                  padding: '8px 16px',
                  borderTopLeftRadius: '6px',
                  borderTopRightRadius: '6px',
                  borderWidth: '0.5px',
                  borderStyle: 'solid',
                  borderColor: isActive ? 'black' : 'gray',
                  cursor: isActive ? 'default' : 'pointer',
                  fontSize: '20px',
                };
              }}
            >
              {title}
            </NavLink>
          ))}
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ py: '1rem' }}>
          <Outlet />
        </Stack>
      </Container>
    </AdminAccess>
  );
}
