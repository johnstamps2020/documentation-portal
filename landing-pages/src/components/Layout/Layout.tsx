import { layoutTheme } from "../../themes/layoutTheme";
import Logo from "../Logo/Logo";
import SearchBox from "../SearchBox/SearchBox";
import AppBar from "@mui/material/AppBar";
import {
  Avatar,
  BottomNavigation,
  Box,
  CssBaseline,
  Grid,
  ImageList,
  ImageListItem,
  Link,
  ThemeProvider,
  Typography,
} from "@mui/material";
import elysianBadge from "../../images/badge-elysian.svg";
import iconAvatar from "../../images/icon-avatar.svg";
import iconGlossary from "../../images/icon-glossary.svg";
import iconTranslatedDocs from "../../images/icon-translatedDocs.svg";
import iconExternalSites from "../../images/icon-externalSites.svg";

type LayoutProps = {
  children: JSX.Element | JSX.Element[];
  title: string;
  searchFilters?: { [key: string]: string[] };
};

export default function Layout({
  children,
  title,
  searchFilters,
}: LayoutProps) {
  document.title = `${title} | Guidewire Documentation`;

  return (
    <div>
      <ThemeProvider theme={layoutTheme}>
        <CssBaseline enableColorScheme />
        <AppBar>
          <ImageList
            style={{ marginLeft: 0, marginRight: "auto", overflow: "hidden" }}
          >
            <ImageListItem>
              <Logo />
            </ImageListItem>
          </ImageList>
          <SearchBox />
          <Grid>
            <Avatar alt="External Sites" src={iconExternalSites} />
            <Avatar alt="Glossary" src={iconGlossary} />
            <Avatar alt="Translated Documents" src={iconTranslatedDocs} />
            <Avatar alt="User Avatar" src={iconAvatar} />
          </Grid>
        </AppBar>
        <main>{children}</main>
        <BottomNavigation>
          <Box sx={{ display: "flex", width: "100%" }}>
            <Typography
              variant="h6"
              style={{ marginRight: "auto", marginLeft: "2%" }}
            >
              {"Copyright 2022 Guidewire Software, Inc."}
            </Typography>
            <Link href="/support">Legal and Support Information</Link>
            <ImageList>
              <ImageListItem>
                <img
                  src={elysianBadge}
                  alt="elysian-badge-logo"
                  style={{
                    height: "20px",
                  }}
                />
              </ImageListItem>
            </ImageList>
            <Typography variant="h6" style={{ marginRight: "2%" }}>
              {"Elysian Release"}
            </Typography>
          </Box>
        </BottomNavigation>
      </ThemeProvider>
    </div>
  );
}
