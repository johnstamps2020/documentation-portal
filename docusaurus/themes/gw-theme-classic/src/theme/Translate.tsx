import React from 'react';
import de from '../i18n/de.json';
import en from '../i18n/en.json';
import es419 from '../i18n/es-419.json';
import esES from '../i18n/es-ES.json';
import fr from '../i18n/fr.json';
import it from '../i18n/it.json';
import ja from '../i18n/ja.json';
import pl from '../i18n/pl.json';
import pt from '../i18n/pt.json';
import { TranslateBaseProps, TranslateProps } from '@theme/Translate';

// keep locale ids in lowercase because we will read the lang attribute in lowercase
const translations = {
  de,
  'de-de': de,
  en,
  'en-us': en,
  'en-gb': en,
  es419,
  'es-419': es419,
  esES,
  'es-es': esES,
  fr,
  'fr-fr': fr,
  'fr-ca': fr,
  it,
  'it-it': it,
  ja,
  'ja-jp': ja,
  pl,
  'pl-pl': pl,
  pt,
  'pt-br': pt,
  'pt-pt': pt,
};

function getTranslation(id: string): string | undefined {
  const lang = document.querySelector('html').getAttribute('lang') || 'en';

  const languageData = translations[lang.toLowerCase()];

  if (languageData) {
    return languageData[id]?.message;
  }
}

export default function Translate(props: TranslateProps) {
  try {
    const DocusaurusTranslate = require('@docusaurus/Translate').default;

    return <DocusaurusTranslate {...props} />;
  } catch (error) {
    return <>{getTranslation(props.id) || props.children}</>;
  }
}

export function translate(props: TranslateBaseProps) {
  try {
    const docusaurusTranslateFunction =
      require('@docusaurus/Translate').translate;

    return docusaurusTranslateFunction(props);
  } catch (error) {
    return getTranslation(props.id) || props.message;
  }
}
