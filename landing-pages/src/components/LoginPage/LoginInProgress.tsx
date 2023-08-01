import Backdrop from '@mui/material/Backdrop';
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
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
