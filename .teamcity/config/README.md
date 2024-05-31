Configuration files were moved to the `documentation-portal-config` repository:
https://stash.guidewire.com/projects/DOCTOOLS/repos/documentation-portal-config/browse.

In the development mode, functions in
`server/src/controllers/legacyConfigController.ts` for uploading the
configuration files to the local database use a relative path to the local copy
of the `documentation-portal-config` repository. Clone the
`documentation-portal-config` repository into the same directory as this
repository before running the upload procedure.
