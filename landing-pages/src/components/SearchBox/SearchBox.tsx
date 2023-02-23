import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useLocaleParams } from "../../hooks/useLocale";

type SearchBoxOptions = {
  bigSize: boolean;
  searchFilters?: { [key: string]: string[] };
};

const commonProps = {
  padding: "2px 4px",
  display: "flex",
  alignItems: "center",
  marginLeft: "auto",
  marginRight: "auto",
  border: "1px solid hsl(214, 22%, 58%)"
};

const bigSizeProps = {
  ...commonProps,
  height: "45px",
  width: "100%",
  maxWidth: "760px"
};

const regularSizeProps = {
  ...commonProps,
  height: "30px",
  width: "100%",
  maxWidth: "400px",
  marginTop: "25px",
  marginBottom: "25px"
};

export default function SearchBox({
  bigSize,
  searchFilters
}: SearchBoxOptions) {
  const { placeholder } = useLocaleParams();
  return (
    <Paper
      component="form"
      action="/landing/search"
      elevation={0}
      sx={bigSize ? { ...bigSizeProps } : { ...regularSizeProps }}
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
