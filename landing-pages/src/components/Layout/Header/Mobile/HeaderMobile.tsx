import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { headerHeight, headerStyles } from '../Header';
import Logo from '../Logo/Logo';

type HeaderMobileProps = {
  menuContents: React.ReactNode;
};

export default function HeaderMobile({ menuContents }: HeaderMobileProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useTheme();

  function handleClose() {
    setMenuOpen(false);
  }

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  return (
    <Stack
      direction="row"
      height={{ xs: 'auto', sm: headerHeight }}
      alignItems="center"
      spacing={1}
      sx={{ ...headerStyles, zIndex: theme.zIndex.drawer + 1 }}
    >
      <IconButton aria-label="Show menu" onClick={toggleMenu}>
        <MenuIcon sx={{ color: 'white', fontSize: '40px' }} />
      </IconButton>
      <Logo />
      <Drawer anchor="left" open={menuOpen} onClose={handleClose}>
        <Stack
          sx={{
            height: '100%',
            px: 3,
            py: 4,
            gap: 3,
            paddingTop: `calc(${headerHeight} + 2rem)`,
          }}
        >
          {menuContents}
        </Stack>
      </Drawer>
    </Stack>
  );
}
