import React from 'react';
import en from '../i18n/en.json';
import pl from '../i18n/pl.json';
import ja from '../i18n/ja.json';
import { TranslateBaseProps, TranslateProps } from '@theme/Translate';

// keep locale ids in lowercase because we will read the lang attribute in lowercase
const translations = {
  en,
  'en-us': en,
  'en-gb': en,
  pl,
  'pl-pl': pl,
  ja,
  'ja-jp': ja,
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
