import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { SidebarProps } from '../../../pages/LandingPage/LandingPage';
import FamilyProductItem from './ProductFamilyItem';

export default function ProductFamilySidebar({ label, items }: SidebarProps) {
  return (
    <Paper
      sx={{
        height: 'fit-content',
        minHeight: '180px',
        minWidth: '270px',
        width: {
          sm: 'fit-content',
          xs: '100%',
        },
        padding: '24px',
      }}
    >
      <Typography variant="h2">{label}</Typography>
      <>
        {items.map(sidebarItem => (
          <FamilyProductItem key={sidebarItem.label} {...sidebarItem} />
        ))}
      </>
    </Paper>
  );
}
