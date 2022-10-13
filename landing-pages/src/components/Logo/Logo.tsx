import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";
import { ReactComponent as LogoLarge } from "./img/gw-docs-logo-impact-color.svg";
import smallLogo from "./img/logo41.png";

export default function Logo() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <Link to="/" aria-label="Return to the home page">
      {isLargeScreen ? <LogoLarge /> : <img alt="" src={smallLogo} />}
    </Link>
  );
}
