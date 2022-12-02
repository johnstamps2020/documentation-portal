import { layoutTheme } from "../../themes/layoutTheme";
import Logo from "../Logo/Logo";
import SearchBox from "../SearchBox/SearchBox";
import AppBar from "@mui/material/AppBar";
import {
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
import dobsonBadge from "../../images/badge-dobson.svg";
import React from "react";
import ExternalSites from "../NavigationButtons/ExternalSites/ExternalSites";
import TranslatedPages from "../NavigationButtons/TranslatedPages/TranslatedPages";
import Glossary from "../NavigationButtons/Glossary/Glossary";
import UserProfile from "../NavigationButtons/UserProfile/UserProfile";

type LayoutProps = {
  children: JSX.Element | JSX.Element[];
  title: string;
  searchFilters?: { [key: string]: string[] };
  hideSearchBox?: boolean;
  path?: string;
};

export default function Layout({
  children,
  title,
  searchFilters,
  hideSearchBox,
  path,
}: LayoutProps) {
  document.title = `${title} | Guidewire Documentation`;
  let badge;
  if (path && path.endsWith("dobson")) {
    badge = dobsonBadge;
  } else if (path && path.endsWith("elysian")) {
    badge = elysianBadge;
  }
  return (
    <div>
      <ThemeProvider theme={layoutTheme}>
        <CssBaseline enableColorScheme />
        <AppBar>
          <ImageList
            className="gw-logo-top"
            {...layoutTheme.components?.MuiImageList?.defaultProps}
          >
            <ImageListItem>
              <Logo />
            </ImageListItem>
          </ImageList>
          {!hideSearchBox && <SearchBox {...searchFilters} />}
          <Grid>
            <ExternalSites />
            <Glossary />
            <TranslatedPages />
            <UserProfile />
          </Grid>
        </AppBar>
        <main>{children}</main>
        <BottomNavigation>
          <Box sx={{ display: "flex", width: "100%" }}>
            <Typography variant="h6">
              {"Copyright 2022 Guidewire Software, Inc."}
            </Typography>
            <Link href="/support">Legal and Support Information</Link>
            <ImageList className="badge">
              <ImageListItem>
                {badge && (
                  <img
                    src={badge}
                    alt="badge-logo"
                    style={{
                      height: "22px",
                    }}
                  />
                )}
              </ImageListItem>
            </ImageList>
            <Typography
              variant="h6"
              style={{ marginLeft: "3px", marginRight: "2%" }}
            >
              {`${title} Release`}
            </Typography>
          </Box>
        </BottomNavigation>
      </ThemeProvider>
    </div>
  );
}
