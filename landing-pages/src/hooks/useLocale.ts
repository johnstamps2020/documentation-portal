type L10N = {
  placeholder: string;
  lang: string;
};

type l10NMapping = {
  [x: string]: L10N;
};

const l10nMappings: l10NMapping = {
  "de-DE": {
    placeholder: "Suche",
    lang: "de",
  },

  "fr-FR": {
    placeholder: "Chercher",
    lang: "fr",
  },

  "es-ES": {
    placeholder: "Buscar",
    lang: "es",
  },
  "es-LA": {
    placeholder: "Buscar",
    lang: "es",
  },
  "it-IT": {
    placeholder: "Ricerca",
    lang: "it",
  },
  "ja-JP": {
    placeholder: "探す",
    lang: "ja",
  },
  "nl-NL": {
    placeholder: "Zoeken",
    lang: "nl",
  },
  "pt-BR": {
    placeholder: "Procurar",
    lang: "pt",
  },
  ru: {
    placeholder: "Поиск",
    lang: "ru",
  },
};

export function useLocaleParams(): L10N {
  const navigatorLanguage = navigator.language;
  console.log({ navigatorLanguage });
  const matchingLocaleParams = l10nMappings[navigatorLanguage];
  if (matchingLocaleParams) {
    return matchingLocaleParams;
  }

  return {
    placeholder: "Search",
    lang: "en",
  };
}
