import Drawer from '@mui/material/Drawer';
import { useSearchLayoutContext } from './SearchLayoutContext';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import AdvancedSearchHelpContents from './AdvancedSearchHelpContents';
import IconButton from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useMobile } from 'hooks/useMobile';
import Divider from '@mui/material/Divider';

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

  const drawerWidth = '60ch';

  return (
    <Drawer
      open={isHelpExpanded}
      onClose={() => setIsHelpExpanded(false)}
      anchor="right"
      variant={isMobile ? 'temporary' : 'persistent'}
      sx={{
        '& .MuiDrawer-root': {
          position: 'absolute',
        },
        '& .MuiPaper-root': {
          position: 'absolute',
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
