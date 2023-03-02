import Stack from '@mui/material/Stack';
import CategoryItem from './CategoryItem';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { SidebarProps } from '../../../pages/LandingPage/LandingPage';
import { useLandingPageItems } from '../../../hooks/useLandingPageItems';

export default function CategorySidebar({ label, items }: SidebarProps) {
  const { landingPageItems, isLoading, isError} = useLandingPageItems(items);

  if (isLoading || isError || !landingPageItems ) {
    return null;
  }
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
      {landingPageItems.map((sidebarItem) => (
          <CategoryItem {...sidebarItem} key={sidebarItem.label} />
        ))}
      </Stack>
    </Paper>
  );
}
