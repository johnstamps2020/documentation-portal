import Avatar, { AvatarProps } from "@mui/material/Avatar";
import Divider, { DividerProps } from "@mui/material/Divider";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Link, { LinkProps } from "@mui/material/Link";
import Menu, { MenuProps } from "@mui/material/Menu";
import { styled } from "@mui/material/styles";
import Typography, { TypographyProps } from "@mui/material/Typography";

export const HeaderAvatar = styled(Avatar)<AvatarProps>(() => ({
  height: "25px",
  width: "25px"
}));

export const HeaderMenuTitle = styled(Typography)<TypographyProps>(() => ({
  fontSize: 16,
  marginLeft: "16px",
  marginRight: "auto",
  width: "100%"
}));

export const HeaderMenuSubtitle = styled(Typography)<TypographyProps>(() => ({
  fontSize: 12,
  marginLeft: "16px",
  marginRight: "auto",
  marginTop: 0,
  color: "hsl(204, 12%, 45%)",
  width: "100%"
}));

export const HeaderMenu = (props: MenuProps) => (
  <Menu
    disableScrollLock={true}
    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    transformOrigin={{ horizontal: "right", vertical: "top" }}
    PaperProps={{
      elevation: 0,
      sx: {
        overflow: "visible",
        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
        mt: "0.5rem",
        padding: "20px",
        width: "fit-content"
      }
    }}
    {...props}
  />
);

export const HeaderMenuLink = styled(Link)<LinkProps>(() => ({
  textDecoration: "none",
  color: "hsl(196, 100%, 31%)",
  fontSize: 14,
  fontWeight: 400,
  padding: 0,
  margin: 0
}));

export const HeaderMenuDivider = styled(Divider)<DividerProps>(() => ({
  border: "1px solid",
  margin: "8px 0",
  color: "hsl(214, 22%, 58%)"
}));

export const HeaderIconButton = styled(IconButton)<IconButtonProps>(() => ({
  padding: 0,
  margin: 0
}));

export const FooterText = styled(Typography)<TypographyProps>(() => ({
  fontSize: 11,
  fontWeight: 600,
  marginTop: "22px",
  color: "white"
}));
