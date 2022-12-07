import { Menu, MenuItem } from "@mui/material";
import React from "react";
import iconTranslatedDocs from "../../../images/icon-translatedDocs.svg";
import {
  HeaderAvatar,
  HeaderIconButton,
  HeaderMenu,
  HeaderMenuDivider,
  HeaderMenuLink,
  HeaderMenuTitle
} from "../StyledLayoutComponents";

export default function TranslatedPages() {
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(
    null
  );

  const pages = [
    { label: "Deutsch", url: "/l10n/de-DE" },
    { label: "Español (España)", url: "/l10n/es-ES" },
    { label: "Español", url: "/l10n/es-LA" },
    { label: "Français", url: "/l10n/fr-FR" },
    { label: "Italiano", url: "/l10n/it-IT" },
    { label: "日本語", url: "/l10n/ja-JP" },
    { label: "Nederlands", url: "/l10n/nl-NL" },
    { label: "Português", url: "/l10n/pt-BR" }
  ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorElement(null);
  };

  return (
    <div>
      <HeaderIconButton id="translated-documents" onClick={handleClick}>
        <HeaderAvatar alt="Translated Documents" src={iconTranslatedDocs} />
      </HeaderIconButton>
      <HeaderMenu
        anchorEl={anchorElement}
        id="translated-docs-menu"
        open={Boolean(anchorElement)}
        onClose={handleClose}
        onClick={handleClose}
      >
        <HeaderMenuTitle>Translated documentation</HeaderMenuTitle>
        <HeaderMenuDivider />
        {pages.map(p => (
          <MenuItem key={p.label}>
            <HeaderMenuLink href={p.url}>{p.label}</HeaderMenuLink>
          </MenuItem>
        ))}
      </HeaderMenu>
    </div>
  );
}
