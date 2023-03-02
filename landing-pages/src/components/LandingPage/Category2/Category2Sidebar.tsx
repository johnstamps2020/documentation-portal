import Stack from '@mui/material/Stack';
import Category2Item from './Category2Item';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { SidebarProps } from '../../../pages/LandingPage/LandingPage';
import { useLandingPageItems } from '../../../hooks/useLandingPageItems';

export default function Category2Sidebar({ label, items }: SidebarProps) {
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
      <Typography variant="h2" sx={{ fontSize: "1.25rem", fontWeight: "600" }}>
        {label}
      </Typography>
      <Divider />
      <Stack
        spacing={1}
        sx={{ spacing: 1, fontSize: "0.875rem", color: "black" }}
      >
        {landingPageItems.map((sidebarItem) => (
          <Category2Item {...sidebarItem} key={sidebarItem.label} />
        ))}
      </Stack>
    </Paper>
  );
}
