/**
 * Load the libraries for the DITA topics pages.
 */
define(["require", "test_elastic_search/resources/input/http-server/cloud/gcp/latest/oxygen-webhelp/app/config"], function() {
    require([
        'polyfill',
        'menu',
        'toc',
        'searchAutocomplete',
        'webhelp',
        'search-init',
        'expand',
        'image-map',
        'template-module-loader',
        'bootstrap'
    ]);
});