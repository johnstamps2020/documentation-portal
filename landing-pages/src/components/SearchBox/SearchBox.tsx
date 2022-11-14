import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useLocaleParams } from "../../hooks/useLocale";

export default function SearchBox(searchFilters: { [key: string]: string[] }) {
  const { placeholder } = useLocaleParams();
  return (
    <Paper
      component="form"
      elevation={0}
      action="/landing/search"
      sx={{
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: "760px",
        border: "1px solid hsl(214, 22%, 58%)",
        height: "48px"
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        inputProps={{ "aria-label": placeholder }}
        name="q"
      />
      {searchFilters &&
        Object.keys(searchFilters).map((k: string) => (
          <InputBase
            id={k.toLowerCase()}
            key={k.toLowerCase()}
            type="hidden"
            name={k}
            value={searchFilters[k].join(",")}
          />
        ))}
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
