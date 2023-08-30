# gw-theme-classic

**Important:** If you're **not** planning on deploying to docs.guidewire.com,
**do not use** `gw-theme-classic`. This theme relies on docs.guidewire.com to
provide the search functionality.

This is the Guidewire theme for publishing Docusaurus sites to
docs.guidewire.com.

Set your access to the @doctools scope in Artifactory: see the main README in
this repo

## Install

```
yarn add @doctools/gw-theme-classic@<version here>
```

Look up the latest version in `package.json` or in Artifactory.

## Set theme in docusaurus.config.js

At the root of your config, add:

```
themes: ["@doctools/gw-theme-classic"],
```

## Set baseUrl (MANDATORY)

Docusaurus requires `baseUrl` when published to a sub-path in a domain. When
publishing to docs.guidewire.com, you can use the `BASE_URL` environment
variable to set it. This variable is present in all standard builds on
docs.guidewire.com.

In you `docusaurus.config.js`:

```js
// docusaurus.config.js
baseUrl: process.env["BASE_URL"] || "/",
```

## Navbar and logo

The navbar (top bar) is set so that it matches Guidewire styles and contains the
following:

- A logo that points to the root of the documentation site (not your site)
- A version selector which points to other versions of your site published to
  docs.guidewire.com
- A search box that uses site metadata to apply filters to your searches
- A log in/out button that checks user identity using the API available on
  docs.guidewire.com.
