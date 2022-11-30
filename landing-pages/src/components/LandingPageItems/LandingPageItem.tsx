import { Link } from "react-router-dom";
import { Item } from "@documentation-portal/dist/model/entity/Item";
import { landingPageTheme } from "../../themes/landingPageTheme";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import { ThemeProvider } from "@mui/material";
import internalLogo from "../../images/internal_document_icon.svg";

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
          {item.doc?.internal && (
            <img
              src={internalLogo}
              alt="internal-document"
              height="25px"
              width="25px"
            ></img>
          )}
        </Stack>
      </div>
    </ThemeProvider>
  );
}
