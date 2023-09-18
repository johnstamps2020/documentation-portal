import { translatedPages } from '../TranslatedPages';
import ItemListMobile from './ItemListMobile';

export default function TranslatedPagesMobile() {
  return (
    <ItemListMobile title="Translated documentation" items={translatedPages} />
  );
}
