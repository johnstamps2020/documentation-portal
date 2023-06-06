import Drawer from '@mui/material/Drawer';
import { useSearchLayoutContext } from './SearchLayoutContext';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import AdvancedSearchHelpContents from './AdvancedSearchHelpContents';
import IconButton from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useMobile } from 'hooks/useMobile';
import Divider from '@mui/material/Divider';
import { headerHeight } from 'components/Layout/Header/Header';
import { footerHeight } from 'components/Layout/Footer';

function DrawerHeader(props: StackProps) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        alignItems: 'center',
        padding: { xs: 1, sm: 3 },
      }}
    >
      {props.children}
    </Stack>
  );
}

export default function AdvancedSearchHelpSection() {
  const { isHelpExpanded, setIsHelpExpanded } = useSearchLayoutContext();
  const { isMobile } = useMobile();

  function handleClose() {
    setIsHelpExpanded(false);
  }

  return (
    <Drawer
      open={isHelpExpanded}
      onClose={() => setIsHelpExpanded(false)}
      anchor="right"
      variant={isMobile ? 'temporary' : 'persistent'}
      sx={{
        paddingTop: headerHeight,
        paddingBottom: footerHeight,
        [`& .MuiDrawer-paper`]: {
          boxSizing: 'border-box',
          paddingTop: headerHeight,
          paddingBottom: footerHeight,
        },
      }}
    >
      <DrawerHeader>
        <IconButton onClick={handleClose} aria-label="close help panel">
          <ChevronRightIcon />
        </IconButton>
        <Typography variant="h2" sx={{ padding: 0 }}>
          Advanced search
        </Typography>
      </DrawerHeader>
      <Divider />
      <AdvancedSearchHelpContents />
    </Drawer>
  );
}
