# Localization Package Builder

The localization package builder collects a list of resources used in a dita build from the json/build-data.json artifact in the latest staging build corresponding to the document. It copies these resources from the repository and creates a zip package which can be sent to translation vendors.

If there is no latest staging build, or the latest staging build does not have a build-json artifact, the Localization Package Builder triggers a staging build and then downloads the artifact once it completes.
