import iconTranslatedDocs from 'images/icon-translatedDocs.svg';
import { TranslatedPagesProps } from '../TranslatedPages';
import HeaderMenuDesktop from './HeaderMenuDesktop';

export default function TranslatedPagesDesktop({
  items,
}: TranslatedPagesProps) {
  return (
    <HeaderMenuDesktop
      title="Translated documentation"
      iconSrc={iconTranslatedDocs}
      id="translated-documents"
      items={items}
    />
  );
}
