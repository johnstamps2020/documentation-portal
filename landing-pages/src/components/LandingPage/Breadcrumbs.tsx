import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { Link as RouterLink } from '@tanstack/react-router';
import { useBreadcrumbs } from 'hooks/useApi';
import { useEffect, useState } from 'react';
import tinycolor from 'tinycolor2';

const breadcrumbLinkClassName = 'breadcrumbLink';

function hasNonDefaultBackground(backgroundProp: string): boolean {
  return (
    !backgroundProp.includes('transparent') &&
    !backgroundProp.startsWith('rgba(0, 0, 0, 0)')
  );
}

function getInheritedBackgroundColor(element: HTMLElement): string {
  const { backgroundColor, background } = window.getComputedStyle(element);

  if (
    hasNonDefaultBackground(backgroundColor) ||
    hasNonDefaultBackground(background)
  ) {
    return backgroundColor;
  }

  // if we've reached the top parent element without getting an explicit color, return default
  if (!element.parentElement) {
    return 'transparent';
  }

  // otherwise, recurse and try again on parent element
  return getInheritedBackgroundColor(element.parentElement);
}

export default function Breadcrumbs() {
  const { breadcrumbs, isError, isLoading } = useBreadcrumbs();
  const [linkColor, setLinkColor] = useState('default');

  useEffect(() => {
    const breadcrumbLinkElement = document.querySelector(
      `.${breadcrumbLinkClassName}`
    );

    if (breadcrumbLinkElement) {
      const linkBackgroundColor = tinycolor(
        getInheritedBackgroundColor(breadcrumbLinkElement as HTMLElement)
      );

      if (linkBackgroundColor.isDark()) {
        setLinkColor('#a2e4fc');
      }
    }
  }, [breadcrumbs]);

  if (isError || isLoading || !breadcrumbs) {
    return null;
  }

  return (
    <Stack direction="row" divider={<ChevronRightIcon />} spacing={1}>
      {breadcrumbs &&
        breadcrumbs.map(({ path, label, id }) => (
          <Link
            component={RouterLink}
            to={`/${path}`}
            key={id}
            className={breadcrumbLinkClassName}
            sx={{
              color: linkColor,
            }}
          >
            {label}
          </Link>
        ))}
      {!breadcrumbs && <div style={{ height: '24px' }}></div>}
    </Stack>
  );
}
