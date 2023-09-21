import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

type LoginInProgressProps = {
  loginIsInProgress: boolean;
};
export default function LoginInProgress({
  loginIsInProgress,
}: LoginInProgressProps) {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loginIsInProgress}
    >
      <Box sx={{ position: 'relative' }}>
        <CircularProgress color="inherit" />
        <Box sx={{ position: 'absolute', top: 10, left: 10 }}>🥐</Box>
      </Box>
    </Backdrop>
  );
}
