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
  const [anchorElExt, setAnchorElExt] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElGloss, setAnchorElGloss] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElTrans, setAnchorElTrans] = React.useState<null | HTMLElement>(
    null
  );
  const [
    anchorElProfile,
    setAnchorElProfile,
  ] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (event.currentTarget.id === "external-sites") {
      setAnchorElExt(event.currentTarget);
    }
    if (event.currentTarget.id === "glossary") {
      setAnchorElGloss(event.currentTarget);
    }
    if (event.currentTarget.id === "translated-documents") {
      setAnchorElTrans(event.currentTarget);
    }
    if (event.currentTarget.id === "profile") {
      setAnchorElProfile(event.currentTarget);
    }
  };
  const handleClose = () => {
    setAnchorElExt(null);
    setAnchorElGloss(null);
    setAnchorElTrans(null);
    setAnchorElProfile(null);
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
            <IconButton id="external-sites" onClick={handleClick}>
              <Avatar alt="External Sites" src={iconExternalSites} />
            </IconButton>
            <IconButton id="glossary" onClick={handleClick}>
              <Avatar alt="Glossary" src={iconGlossary} />
            </IconButton>
            <IconButton id="translated-documents" onClick={handleClick}>
              <Avatar alt="Translated Documents" src={iconTranslatedDocs} />
            </IconButton>
            <IconButton id="profile" onClick={handleClick}>
              <Avatar alt="User Avatar" src={iconAvatar} />
            </IconButton>
          </Grid>
        </AppBar>
        <Menu
          anchorEl={anchorElExt}
          id="external-sites-menu"
          open={Boolean(anchorElExt)}
          onClose={handleClose}
          onClick={handleClose}
        >
          <Typography variant="body1">Guidewire sites</Typography>
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
        <Menu
          anchorEl={anchorElGloss}
          id="glossary-menu"
          open={Boolean(anchorElGloss)}
          onClose={handleClose}
          onClick={handleClose}
        >
          <MenuItem>
            <Link href="https://docs.int.ccs.guidewire.net/glossary">
              Guidewire Glossary
            </Link>
          </MenuItem>
        </Menu>
        <Menu
          anchorEl={anchorElTrans}
          id="translated-docs-menu"
          open={Boolean(anchorElTrans)}
          onClose={handleClose}
          onClick={handleClose}
        >
          <Typography variant="body1">Translated documentation</Typography>
          <Divider />
          <MenuItem>
            <Link href="">Deutch</Link>
          </MenuItem>
          <MenuItem>
            <Link href="">Español (España)</Link>
          </MenuItem>
          <MenuItem>
            <Link href="">Español</Link>
          </MenuItem>
          <MenuItem>
            <Link href="">Français</Link>
          </MenuItem>
          <MenuItem>
            <Link href="">Italiano</Link>
          </MenuItem>
          <MenuItem>
            <Link href="">日本語</Link>
          </MenuItem>
          <MenuItem>
            <Link href="">Nederlands</Link>
          </MenuItem>
          <MenuItem>
            <Link href="">Português</Link>
          </MenuItem>
        </Menu>
        <Menu
          anchorEl={anchorElProfile}
          id="profile-menu"
          open={Boolean(anchorElProfile)}
          onClose={handleClose}
          onClick={handleClose}
        >
          <Typography variant="body1">Name Surname</Typography>
          <Typography variant="h5">e-mail address</Typography>
          <Divider />
          <MenuItem>
            <Link href="" style={{ color: "black" }}>
              Log out
            </Link>
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
