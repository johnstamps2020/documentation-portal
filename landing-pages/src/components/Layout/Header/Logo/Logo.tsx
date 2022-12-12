import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "@mui/material/Link";
import { ReactComponent as LogoLarge } from "./img/gw-docs-logo-impact-color.svg";
import smallLogo from "./img/logo41.png";

export default function Logo() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <Link href="/landing" aria-label="Return to the home page">
      {isLargeScreen ? (
        <LogoLarge style={{ height: "40px", width: "400px" }} />
      ) : (
        <img alt="" src={smallLogo} />
      )}
    </Link>
  );
}
