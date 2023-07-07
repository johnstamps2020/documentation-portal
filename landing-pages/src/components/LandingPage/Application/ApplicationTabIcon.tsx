import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MenuIcon from '@mui/icons-material/Menu';
import CodeIcon from '@mui/icons-material/Code';
import FilterListIcon from '@mui/icons-material/FilterList';
import DashboardIcon from '@mui/icons-material/Dashboard';

export type ApplicationTabIconProps = {
  icon:
    | 'get-started'
    | 'learn-about'
    | 'configure'
    | 'integrate'
    | 'administer';
};

export default function ApplicationTabIcon({
  icon,
}: ApplicationTabIconProps): JSX.Element | null {
  switch (icon) {
    case 'get-started':
      return <NotificationsActiveIcon />;
    case 'learn-about':
      return <MenuIcon />;
    case 'configure':
      return <CodeIcon />;
    case 'integrate':
      return <FilterListIcon />;
    case 'administer':
      return <DashboardIcon />;
    default:
      return null;
  }
}
