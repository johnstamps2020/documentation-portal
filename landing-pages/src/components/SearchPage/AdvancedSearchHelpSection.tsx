import Drawer from '@mui/material/Drawer';
import { useSearchLayoutContext } from './SearchLayoutContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import AdvancedSearchHelpContents from './AdvancedSearchHelpContents';
import IconButton from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useMobile } from 'hooks/useMobile';
import { useTheme } from '@mui/material/styles';

export default function AdvancedSearchHelpSection() {
  const theme = useTheme();
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
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      <Box
        sx={{
          width: '60ch',
          padding: 3,
          [theme.breakpoints.down('sm')]: {
            width: 300,
          },
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
          }}
        >
          <IconButton onClick={handleClose} aria-label="close help panel">
            <ChevronRightIcon />
          </IconButton>
          <Typography variant="h2" sx={{ padding: 0 }}>
            Advanced search
          </Typography>
        </Stack>
        <AdvancedSearchHelpContents />
      </Box>
    </Drawer>
  );
}
