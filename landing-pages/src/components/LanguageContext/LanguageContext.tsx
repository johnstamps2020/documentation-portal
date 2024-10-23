import { createContext, useContext, useState } from 'react';
import { IntlProvider } from 'react-intl';
import de from './compiled-lang/de.json';
import en from './compiled-lang/en.json';
import es419 from './compiled-lang/es-419.json';
import esES from './compiled-lang/es-ES.json';
import fr from './compiled-lang/fr.json';
import it from './compiled-lang/it.json';
import ja from './compiled-lang/ja.json';
import nl from './compiled-lang/nl.json';
import pl from './compiled-lang/pl.json';
import pt from './compiled-lang/pt.json';
import yy from './compiled-lang/yy.json';

// When adding or removing locales here, do the same in landing-pages/src/scripts/compile-locales.mjs
// I couldn't find a way to import between .mjs and Typescript 😅
const LOCALES = [
  'de',
  'en',
  'es-419',
  'es-ES',
  'fr',
  'it',
  'ja',
  'nl',
  'pl',
  'pt',
  'yy',
] as const;
type Locale = (typeof LOCALES)[number];
const DEFAULT_LOCALE: Locale = 'en';

interface LanguageContextInterface {
  selectedLocale: Locale;
  changeLocale: (newLocale: Locale) => void;
  availableLocales: Locale[];
}

const LanguageContext = createContext<LanguageContextInterface | null>(null);

function getMessages(selectedLocale: Locale) {
  switch (selectedLocale) {
    case 'de':
      return de;
    case 'en':
      return en;
    case 'es-419':
      return es419;
    case 'es-ES':
      return esES;
    case 'fr':
      return fr;
    case 'it':
      return it;
    case 'ja':
      return ja;
    case 'nl':
      return nl;
    case 'pt':
      return pt;
    case 'pl':
      return pl;
    case 'yy':
      return yy;
    default:
      return en;
  }
}

export function LanguageContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedLocale, setSelectedLocale] = useState<Locale>(DEFAULT_LOCALE);

  const changeLocale: LanguageContextInterface['changeLocale'] = (newLocale) =>
    setSelectedLocale(newLocale);

  return (
    <LanguageContext.Provider
      value={{
        selectedLocale,
        changeLocale,
        availableLocales: LOCALES.map((locale) => locale as Locale),
      }}
    >
      <IntlProvider
        locale={selectedLocale}
        defaultLocale={DEFAULT_LOCALE}
        messages={getMessages(selectedLocale)}
      >
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const value = useContext(LanguageContext);

  if (!value) {
    throw new Error(
      'useLanguageContext must be used within LanguageContextProvider'
    );
  }

  return value;
}
