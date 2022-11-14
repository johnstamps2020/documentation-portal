import Logo from "../Logo/Logo";
import SearchBox from "../SearchBox/SearchBox";
import styles from "./Layout.module.css";
import AppBar from "@mui/material/AppBar";
import { BottomNavigation, Link, Typography } from "@mui/material";
import { Container } from "@mui/system";

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
      <AppBar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          height: "80px",
          padding: "6px",
          backgroundColor: "hsl(216, 42%, 13%)",
        }}
      >
        <Logo />
        <SearchBox />
      </AppBar>
      <main>{children}</main>
      <BottomNavigation
        sx={{
          backgroundColor: "hsl(216, 42%, 13%)",
          color: "hsl(0, 0%, 98%)",
          display: "flex",
          alignItems: "left",
        }}
      >
        <Container sx={{ display: "flex", marginLeft: 1 }}>
          <Typography
            variant="h4"
            style={{
              fontSize: "0.75rem",
              fontWeight: 400,
              paddingTop: 20,
              marginRight: "50%",
            }}
          >
            {"Copyright 2022 Guidewire Software, Inc."}
          </Typography>
          <Link
            href="/support"
            sx={{
              fontSize: "0.75rem",
              fontWeight: 400,
              paddingTop: "20px",
              marginRight: "75%",
            }}
          >
            Legal and Support Information
          </Link>
          <Typography
            variant="h4"
            style={{
              fontSize: "0.75rem",
              fontWeight: 400,
              paddingTop: 20,
            }}
          >
            {"Elysian Release"}
          </Typography>
        </Container>
      </BottomNavigation>
    </div>
  );
}
