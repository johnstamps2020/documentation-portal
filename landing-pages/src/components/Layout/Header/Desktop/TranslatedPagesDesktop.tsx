import iconTranslatedDocs from 'images/icon-translatedDocs.svg';
import { translatedPages } from '../TranslatedPages';
import HeaderMenuDesktop from './HeaderMenuDesktop';

export default function TranslatedPagesDesktop() {
  return (
    <HeaderMenuDesktop
      title="Translated documentation"
      iconSrc={iconTranslatedDocs}
      id="translated-documents"
      items={translatedPages}
    />
  );
}
