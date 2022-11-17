import { layoutTheme } from "../../themes/layoutTheme";
import Logo from "../Logo/Logo";
import SearchBox from "../SearchBox/SearchBox";
import AppBar from "@mui/material/AppBar";
import {
  Avatar,
  BottomNavigation,
  Box,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  Link,
  ListItemIcon,
  Menu,
  MenuItem,
  ThemeProvider,
  Typography,
} from "@mui/material";
import elysianBadge from "../../images/badge-elysian.svg";
import iconAvatar from "../../images/icon-avatar.svg";
import iconGlossary from "../../images/icon-glossary.svg";
import iconTranslatedDocs from "../../images/icon-translatedDocs.svg";
import iconExternalSites from "../../images/icon-externalSites.svg";
import React from "react";
import { PersonAdd, Settings, Logout } from "@mui/icons-material";

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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
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
            <IconButton
              onClick={handleClick}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar alt="External Sites" src={iconExternalSites} />
            </IconButton>
            <IconButton
              onClick={handleClick}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar alt="Glossary" src={iconGlossary} />
            </IconButton>
            <IconButton
              onClick={handleClick}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar alt="Translated Documents" src={iconTranslatedDocs} />
            </IconButton>
            <Avatar alt="User Avatar" src={iconAvatar} />
          </Grid>
        </AppBar>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
        >
          <Typography>Guidewire sites</Typography>
          <Divider />
          <MenuItem>
            <Link href="https://community.guidewire.com/s/login">
              Customer Community
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href="https://partner.guidewire.com/s/login">
              Partner Portal
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href="https://developer.guidewire.com">Developer</Link>
          </MenuItem>
          <MenuItem>
            <Link href="https://education.guidewire.com/lmt/xlr8login.login?site=guidewire">
              Education
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href="https://www.guidewire.com">Guidewire Website</Link>
          </MenuItem>
        </Menu>
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
