/**
 * Load the Main Page (index.html) libraries.
 */
define(["require", "test_elastic_search/resources/input/http-server/cloud/gcp/latest/oxygen-webhelp/app/config"], function() {
    require([
        'polyfill',
        'menu',
        'searchAutocomplete',
        'webhelp',
        'search-init',
        'context-help',
        'template-module-loader',
        'bootstrap'
    ]);
});
