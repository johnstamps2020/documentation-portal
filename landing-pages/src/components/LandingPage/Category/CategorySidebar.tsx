import Stack from '@mui/material/Stack';
import CategoryItem from './CategoryItem';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { SidebarProps } from '../../../pages/LandingPage/LandingPage';

export default function CategorySidebar({ label, items }: SidebarProps) {
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
      <Stack spacing={1}>
      {items.map((sidebarItem) => (
          <CategoryItem {...sidebarItem} key={sidebarItem.label} />
        ))}
      </Stack>
    </Paper>
  );
}
