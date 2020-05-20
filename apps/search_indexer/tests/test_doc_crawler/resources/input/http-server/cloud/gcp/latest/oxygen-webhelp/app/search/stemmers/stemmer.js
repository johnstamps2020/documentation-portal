define(["options", "test_elastic_search/resources/input/http-server/cloud/gcp/latest/oxygen-webhelp/app/search/stemmers/en_stemmer", "tests/test_doc_crawler/resources/input/http-server/cloud/gcp/latest/oxygen-webhelp/app/search/stemmers/de_stemmer", "fr_stemmer"], function(options, en_stemmer, de_stemmer, fr_stemmer) {
    var indexerLang = options.getIndexerLanguage();
    if (indexerLang == 'en') {
        return en_stemmer;
    } else if (indexerLang == 'de') {
        return de_stemmer;
    } else if (indexerLang == 'fr') {
        return fr_stemmer;
    } else {
        // Do nothing
    }
});