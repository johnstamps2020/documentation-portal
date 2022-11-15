import { layoutTheme } from "../../themes/layoutTheme";
import Logo from "../Logo/Logo";
import SearchBox from "../SearchBox/SearchBox";
import AppBar from "@mui/material/AppBar";
import {
  Avatar,
  Badge,
  BottomNavigation,
  Box,
  CardMedia,
  CssBaseline,
  ImageList,
  ImageListItem,
  Link,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import elysianBadge from "../../images/badge-elysian.svg";

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
          <Logo />
          <SearchBox />
        </AppBar>
        <main>{children}</main>
        <BottomNavigation>
          <Box sx={{ display: "flex", width: "100%" }}>
            <Typography
              variant="h6"
              style={{ marginRight: "33%", marginLeft: "2%" }}
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
