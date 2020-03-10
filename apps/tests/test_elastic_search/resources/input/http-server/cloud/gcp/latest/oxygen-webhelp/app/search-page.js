/**
 * Load the libraries for the Search page.
 */
define(["require", "test_elastic_search/resources/input/http-server/cloud/gcp/latest/oxygen-webhelp/app/config"], function() {
    require(['search'], function() {
        require([
            'polyfill',
            'menu',
            'searchAutocomplete',
            'webhelp',
            'template-module-loader'
        ]);
    });
});