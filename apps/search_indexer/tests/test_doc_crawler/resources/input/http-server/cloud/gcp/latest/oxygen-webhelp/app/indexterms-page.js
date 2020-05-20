/**
 * Load the libraries for the Index Terms page.
 */
define(["require", "test_doc_crawler/resources/input/http-server/cloud/gcp/latest/oxygen-webhelp/app/config"], function() {
    require([
        'polyfill',
        'menu',
        'expand',
        'template-module-loader'
    ]);
});