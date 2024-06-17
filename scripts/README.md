# Scripts

## delete-doc

This command-line script deletes a doc and its related build.

The following environment variables are required:

- `DOC_ID`: must be an existing doc, **DO NOT** use made up docs, or future
  docs. If you feel the urge to use a DOC ID which does not exist, please
  reconsider.
- `HOST`: including protocol, for example
  `https://docs.staging.ccs.guidewire.net`.
- `BUILD_TYPE`: either "DitaBuild" or "YarnBuild".

```
yarn workspace @doctools/scripts delete-doc
```

Example on `localhost`:

```
DOC_ID=jutroplatformnext HOST="http://localhost:8081" BUILD_TYPE="YarnBuild" yarn workspace @doctools/scripts delete-doc
```

Example on staging:

```
DOC_ID=jutroplatformnext HOST="https://docs.staging.ccs.guidewire.net" BUILD_TYPE="YarnBuild" yarn workspace @doctools/scripts delete-doc
```
