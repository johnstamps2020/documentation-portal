import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { SidebarProps } from '../../../pages/LandingPage/LandingPage';
import LandingPageLink from '../LandingPageLink';

export default function ProductFamilySidebar({ label, items }: SidebarProps) {
  return (
    <Paper
      sx={{
        width: { xs: '100%', sm: '300px' },
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
      }}
    >
      <Typography variant="h2">{label}</Typography>
      <>
        {items.map((item, key) => (
          <LandingPageLink key={key} item={item} />
        ))}
      </>
    </Paper>
  );
}
