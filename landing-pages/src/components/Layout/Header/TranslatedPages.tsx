import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import TranslatedPagesDesktop from './Desktop/TranslatedPagesDesktop';
import TranslatedPagesMobile from './Mobile/TranslatedPagesMobile';
import { HeaderMenuLinkProps } from '../StyledLayoutComponents';
import { useTranslatedPages } from '../../../hooks/useApi';

export type TranslatedPage = {
  title: string;
  path: string;
};

export type TranslatedPagesProps = {
  items: HeaderMenuLinkProps[];
};
export const translatedPages: TranslatedPage[] = [
  { title: 'Deutsch', path: 'l10n/de-DE' },
  { title: 'Español (España)', path: 'l10n/es-ES' },
  { title: 'Español', path: 'l10n/es-419' },
  { title: 'Français', path: 'l10n/fr-FR' },
  { title: 'Italiano', path: 'l10n/it-IT' },
  { title: '日本語', path: 'l10n/ja-JP' },
  { title: 'Nederlands', path: 'l10n/nl-NL' },
  { title: 'Português', path: 'l10n/pt-BR' },
];

export default function TranslatedPages() {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { pages, isError, isLoading } = useTranslatedPages(translatedPages);

  if (!pages || isError || isLoading) {
    return null;
  }

  const translatedPagesHeaderMenuLinks: HeaderMenuLinkProps[] = pages.map(
    (translatedPage) => ({
      children: translatedPage.title,
      href: `/${translatedPage.path}`,
      disableReactRouter: true,
    })
  );

  if (smallScreen) {
    return <TranslatedPagesMobile items={translatedPagesHeaderMenuLinks} />;
  }

  return <TranslatedPagesDesktop items={translatedPagesHeaderMenuLinks} />;
}
