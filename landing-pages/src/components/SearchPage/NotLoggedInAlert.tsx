import Alert from '@mui/material/Alert/Alert';
import { useSearchData } from '../../hooks/useApi';

export default function NotLoggedInAlert() {
  const { searchData, isError, isLoading } = useSearchData();
  if (
    isError ||
    isLoading ||
    !searchData ||
    searchData.requestIsAuthenticated
  ) {
    return null;
  }
  return (
    <Alert sx={{ justifyContent: 'center', width: '100%' }} severity="warning">
      You are not logged in. Search results are limited to public documents
      only.
    </Alert>
  );
}
