import { layoutThemeOptions } from "../../themes/layoutThemeOptions";
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
  Typography
} from "@mui/material";
import elysianBadge from "../../images/badge-elysian.svg";
import React from "react";
import ExternalSites from "../NavigationButtons/ExternalSites/ExternalSites";
import TranslatedPages from "../NavigationButtons/TranslatedPages/TranslatedPages";
import Glossary from "../NavigationButtons/Glossary/Glossary";
import UserProfile from "../NavigationButtons/UserProfile/UserProfile";
import { createMergedTheme } from "../../themes/createMergedTheme";

type LayoutProps = {
  children: JSX.Element | JSX.Element[];
  title: string;
  searchFilters?: { [key: string]: string[] };
  hideSearchBox?: boolean;
};

export default function Layout({
  children,
  title,
  searchFilters,
  hideSearchBox
}: LayoutProps) {
  document.title = `${title} | Guidewire Documentation`;
  return (
    <div>
      <ThemeProvider
        theme={theme => createMergedTheme(theme, layoutThemeOptions)}
      >
        <CssBaseline enableColorScheme />
        <AppBar>
          <ImageList
            style={{ marginLeft: 0, marginRight: "auto", overflow: "hidden" }}
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
            <Typography
              variant="h6"
              style={{ marginRight: "auto", marginLeft: "2%" }}
            >
              {"Copyright 2022 Guidewire Software, Inc."}
            </Typography>
            <Link
              href="/support"
              sx={{
                underline: "none",
                fontSize: 11,
                fontWeight: 600,
                marginTop: "22px",
                marginRight: "auto",
                marginLeft: "auto",
                color: "white"
              }}
            >
              Legal and Support Information
            </Link>
            <ImageList>
              <ImageListItem>
                <img
                  src={elysianBadge}
                  alt="elysian-badge-logo"
                  style={{
                    height: "20px"
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
