import { TranslatedPagesProps } from '../TranslatedPages';
import ItemListMobile from './ItemListMobile';

export default function TranslatedPagesMobile({ items }: TranslatedPagesProps) {
  return <ItemListMobile title="Translated documentation" items={items} />;
}
