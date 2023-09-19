import { glossaryLink } from '../Glossary';
import ItemListMobile from './ItemListMobile';

export default function GlossaryMobile() {
  return <ItemListMobile title="Glossary" items={[glossaryLink]} />;
}
