import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import {
  HeaderAvatar,
  HeaderIconButton,
  HeaderMenu,
  HeaderMenuDivider,
  HeaderMenuLink,
  HeaderMenuLinkProps,
  HeaderMenuTitle,
  HeaderMenuSubtitle,
} from 'components/Layout/StyledLayoutComponents';
import React, { forwardRef } from 'react';

type HeaderMenuDesktopProps = {
  title: string;
  hideTitle?: boolean;
  subtitle?: string;
  id: string;
  iconSrc: string;
  items: HeaderMenuLinkProps[];
};

export default function HeaderMenuDesktop({
  title,
  hideTitle,
  subtitle,
  id,
  iconSrc,
  items,
}: HeaderMenuDesktopProps) {
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(
    null
  );
  const headerAndTooltipText = title;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (event.currentTarget.id === id) {
      setAnchorElement(event.currentTarget);
    }
  };
  const handleClose = () => {
    setAnchorElement(null);
  };

  const headerItems = hideTitle
    ? null
    : [
        <HeaderMenuTitle key="menu-title">
          {headerAndTooltipText}
        </HeaderMenuTitle>,
        subtitle ? (
          <HeaderMenuSubtitle key="subtitle">{subtitle}</HeaderMenuSubtitle>
        ) : null,
        <HeaderMenuDivider key="menu-divider" />,
      ].filter(Boolean);

  return (
    <Box>
      <HeaderIconButton id={id} onClick={handleClick}>
        <HeaderAvatar alt={title} src={iconSrc} />
      </HeaderIconButton>
      <HeaderMenu
        anchorEl={anchorElement}
        id={`${id}-menu`}
        open={Boolean(anchorElement)}
        onClose={handleClose}
        onClick={handleClose}
      >
        {headerItems}
        {items.map(({ href, children, ...otherProps }) => (
          <MenuItem
            key={href}
            component={HeaderMenuLink}
            href={href}
            sx={{ color: 'hsl(196, 100%, 31%)' }}
            {...otherProps}
          >
            {children}
          </MenuItem>
        ))}
      </HeaderMenu>
    </Box>
  );
}
