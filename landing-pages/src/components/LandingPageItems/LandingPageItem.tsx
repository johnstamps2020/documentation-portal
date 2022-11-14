import { Link } from "react-router-dom";
import { Item } from "@documentation-portal/dist/model/entity/Item";
import { landingPageTheme } from "../../themes/landingPageTheme";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import { ThemeProvider } from "@mui/material";

export default function LandingPageItem(item: Item) {
  const itemHref = item.link || item.doc?.url || item.pagePath;
  return (
    <ThemeProvider theme={landingPageTheme}>
      <CssBaseline enableColorScheme />
      <div>
        <Stack>
          <Link
            to={itemHref}
            style={landingPageTheme.components?.MuiLink?.defaultProps?.style}
          >
            {item.label}
          </Link>
        </Stack>
      </div>
    </ThemeProvider>
  );
}
