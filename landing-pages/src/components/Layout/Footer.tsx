import BottomNavigation from "@mui/material/BottomNavigation";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import elysianBadge from "../../images/badge-elysian.svg";
import dobsonBadge from "../../images/badge-dobson.svg";
import cortinaBadge from "../../images/badge-cortina.svg";
import banffBadge from "../../images/badge-banff.svg";
import aspenBadge from "../../images/badge-aspen.svg";
import { FooterText } from "./StyledLayoutComponents";

type FooterProps = {
  title?: string;
  path?: string;
};

export default function Footer({ title, path }: FooterProps) {
  let badge;
  if (path?.includes("elysian")) {
    badge = elysianBadge;
  } else if (path?.includes("dobson")) {
    badge = dobsonBadge;
  } else if (path?.includes("cortina")) {
    badge = cortinaBadge;
  } else if (path?.includes("banff")) {
    badge = banffBadge;
  } else if (path?.includes("aspen")) {
    badge = aspenBadge;
  }
  return (
    <BottomNavigation
      sx={{
        backgroundColor: "hsl(216, 42%, 13%)",
        color: "hsl(0, 0%, 98%)",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
      }}
    >
      <FooterText sx={{ cols: 1, display: "contents" }}>
        Copyright 2022 Guidewire Software, Inc.
      </FooterText>
      <Link
        href="/support"
        sx={{
          underline: "none",
          color: "white",
        }}
      >
        <FooterText sx={{ display: "contents" }}>
          Legal and Support Information
        </FooterText>
      </Link>
      <Stack direction="row" alignItems="center">
        {badge && (
          <img
            src={badge}
            alt="elysian-badge-logo"
            style={{
              height: "20px",
              display: "block",
              marginRight: "5px",
            }}
          />
        )}

        <FooterText sx={{ display: "contents" }}>{title} Release</FooterText>
      </Stack>
    </BottomNavigation>
  );
}
