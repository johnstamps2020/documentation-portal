import Alert from "@mui/material/Alert/Alert";
import { useSearch } from "../../context/SearchContext";

export default function NotLoggedInAlert() {
  const { searchData } = useSearch();
  if (!searchData || searchData.requestIsAuthenticated) {
    return null;
  }
  return (
    <Alert severity="warning">
      You are not logged in. Search results are limited to public documents
      only.
    </Alert>
  );
}
