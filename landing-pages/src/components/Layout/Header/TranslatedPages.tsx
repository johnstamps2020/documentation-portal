import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import TranslatedPagesDesktop from './Desktop/TranslatedPagesDesktop';
import TranslatedPagesMobile from './Mobile/TranslatedPagesMobile';
import { HeaderMenuLinkProps } from '../StyledLayoutComponents';

export const translatedPages: HeaderMenuLinkProps[] = [
  { children: 'Deutsch', href: '/l10n/de-DE' },
  { children: 'Español (España)', href: '/l10n/es-ES' },
  { children: 'Español', href: '/l10n/es-419' },
  { children: 'Français', href: '/l10n/fr-FR' },
  { children: 'Italiano', href: '/l10n/it-IT' },
  { children: '日本語', href: '/l10n/ja-JP' },
  { children: 'Nederlands', href: '/l10n/nl-NL' },
  { children: 'Português', href: '/l10n/pt-BR' },
].map((link) => ({ ...link, disableReactRouter: true }));

export default function TranslatedPages() {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (smallScreen) {
    return <TranslatedPagesMobile />;
  }

  return <TranslatedPagesDesktop />;
}
