import Backdrop from '@mui/material/Backdrop';
import { useSearchData } from '../../hooks/useApi';

export default function SearchPageBackdrop() {
  const { isLoading } = useSearchData();
  return (
    <Backdrop
      open={isLoading}
      sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
    />
  );
}
