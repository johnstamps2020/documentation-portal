import { MenuItem } from '@mui/material';
import React from 'react';
import iconTranslatedDocs from 'images/icon-translatedDocs.svg';
import {
  HeaderAvatar,
  HeaderIconButton,
  HeaderMenu,
  HeaderMenuDivider,
  HeaderMenuLink,
  HeaderMenuTitle,
} from 'components/Layout/StyledLayoutComponents';

export default function TranslatedPages() {
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(
    null
  );

  const pages = [
    { label: 'Deutsch', url: '/landing/l10n-new/de-DE' },
    { label: 'Español (España)', url: '/landing/l10n-new/es-ES' },
    { label: 'Español', url: '/landing/l10n-new/es-LA' },
    { label: 'Français', url: '/landing/l10n-new/fr-FR' },
    { label: 'Italiano', url: '/landing/l10n-new/it-IT' },
    { label: '日本語', url: '/landing/l10n-new/ja-JP' },
    { label: 'Nederlands', url: '/landing/l10n-new/nl-NL' },
    { label: 'Português', url: '/landing/l10n-new/pt-BR' },
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
        {pages.map((p) => (
          <MenuItem key={p.label}>
            <HeaderMenuLink href={p.url}>{p.label}</HeaderMenuLink>
          </MenuItem>
        ))}
      </HeaderMenu>
    </div>
  );
}
