import iconGlossary from 'images/icon-glossary.svg';
import { glossaryLink } from '../Glossary';
import HeaderMenuDesktop from './HeaderMenuDesktop';

export default function GlossaryDesktop() {
  return (
    <HeaderMenuDesktop
      title="Glossary"
      hideTitle
      iconSrc={iconGlossary}
      id="glossary"
      items={[glossaryLink]}
    />
  );
}
