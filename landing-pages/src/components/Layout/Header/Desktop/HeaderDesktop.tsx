import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { headerHeight, headerStyles } from '../Header';
import Logo from '../Logo/Logo';
import UserProfile from '../UserProfile';

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
    <Stack
      direction="row"
      height={headerHeight}
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{
        ...headerStyles,
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Logo />
      {centerItems}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        width={{ sm: '100%', md: '400px' }}
        gap="24px"
      >
        {rightItems}
        <UserProfile />
      </Stack>
    </Stack>
  );
}
