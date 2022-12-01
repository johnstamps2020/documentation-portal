import BottomNavigation from "@mui/material/BottomNavigation";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import elysianBadge from "../../images/badge-elysian.svg";
import { FooterText } from "./StyledLayoutComponents";

export default function Footer() {
  return (
    <BottomNavigation
      sx={{
        backgroundColor: "hsl(216, 42%, 13%)",
        color: "hsl(0, 0%, 98%)",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px"
      }}
    >
      <FooterText sx={{ cols: 1, display: "contents" }}>
        Copyright 2022 Guidewire Software, Inc.
      </FooterText>
      <Link
        href="/support"
        sx={{
          underline: "none",
          color: "white"
        }}
      >
        <FooterText sx={{ display: "contents" }}>
          Legal and Support Information
        </FooterText>
      </Link>
      <Stack direction="row" alignItems="center">
        <img
          src={elysianBadge}
          alt="elysian-badge-logo"
          style={{
            height: "20px",
            display: "block"
          }}
        />
        <FooterText sx={{ display: "contents" }}>Elysian Release</FooterText>
      </Stack>
    </BottomNavigation>
  );
}
