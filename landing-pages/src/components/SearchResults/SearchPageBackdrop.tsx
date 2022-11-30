import Backdrop from "@mui/material/Backdrop";
import { useSearch } from "../../context/SearchContext";

export default function SearchPageBackdrop() {
  const { loadingSearchData } = useSearch();
  return (
    <Backdrop
      open={loadingSearchData}
      sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}
    />
  );
}
