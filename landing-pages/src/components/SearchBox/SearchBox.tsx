import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import {useLocaleParams} from "../../hooks/useLocale";
import { layoutTheme } from "../../themes/layoutTheme";
import { CssBaseline, ThemeProvider } from "@mui/material";

export default function SearchBox(searchFilters: { [key: string]: string[] }) {
    const {placeholder} = useLocaleParams();
    return (
        <ThemeProvider theme={layoutTheme}>
            <CssBaseline enableColorScheme/>
            <Paper
                component="form"
                elevation={0}
                action="/landing/search"
                sx={{
                    padding: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    height: "30px",
                    maxWidth: 400,
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: "25px",
                    marginBottom: "25px",
                    border: "1px solid hsl(214, 22%, 58%)",
                }}
            >
                <InputBase
                    sx={{ml: 1, flex: 1}}
                    placeholder={placeholder}
                    inputProps={{"aria-label": placeholder}}
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
                <IconButton type="submit" sx={{p: "10px"}} aria-label="search">
                    <SearchIcon/>
                </IconButton>
            </Paper>
        </ThemeProvider>
    );
}
