import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { headerHeight, headerStyles } from '../Header';
import Logo from '../Logo/Logo';
import UserProfile from '../UserProfile';
import Box from '@mui/material/Box';

type HeaderDesktopProps = {
  centerItems: React.ReactNode;
  rightItems: React.ReactNode;
};

export default function HeaderDesktop({
  centerItems,
  rightItems,
}: HeaderDesktopProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...headerStyles,
        height: headerHeight,
        zIndex: theme.zIndex.drawer + 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        alignItems: 'center',
      }}
    >
      <Logo />
      <Box>{centerItems}</Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        gap="24px"
      >
        {rightItems}
        <UserProfile />
      </Stack>
    </Box>
  );
}
