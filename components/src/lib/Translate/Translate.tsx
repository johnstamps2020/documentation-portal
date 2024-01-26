import React from 'react';
import de from './i18n/de.json';
import en from './i18n/en.json';
import es419 from './i18n/es-419.json';
import esES from './i18n/es-ES.json';
import fr from './i18n/fr.json';
import it from './i18n/it.json';
import ja from './i18n/ja.json';
import pl from './i18n/pl.json';
import pt from './i18n/pt.json';

type Message = {
  message: string;
  description?: string;
};

type Language = {
  [key: string]: Message;
};

type Translations = {
  [key: string]: Language;
};

type TranslateFunctionObject = Message & {
  id: string;
};

// keep locale ids in lowercase because we will read the lang attribute in lowercase
const translations: Translations = {
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

function getLanguage(): string {
  if (typeof document !== 'undefined') {
    return document.querySelector('html')?.getAttribute('lang') || 'en';
  }

  return 'en';
}

function getTranslation(id: string): string | undefined {
  const lang = getLanguage();

  const languageData = translations[lang.toLowerCase()];

  if (languageData) {
    return languageData[id]?.message;
  }
}

type TranslateComponentProps = {
  id: string;
  children: string;
  description?: string;
};

export function Translate({
  id,
  children,
}: TranslateComponentProps): JSX.Element {
  const translated = getTranslation(id);

  return <>{translated || children}</>;
}

export function translate({ id, message }: TranslateFunctionObject): string {
  return getTranslation(id) || message;
}
