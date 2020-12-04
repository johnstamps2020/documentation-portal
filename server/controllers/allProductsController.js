const {
  getDocs,
  getTaxonomy,
  getReleasesFromTaxonomies,
} = require('./configController');
const {
  getUniqueInMetadataFields,
  getSortedVersions,
} = require('./helpers/metadata');
const { findNodeById } = require('./helpers/taxonomy');

async function findProductRoute(productId, productVersion) {
  const availableReleases = await getReleasesFromTaxonomies();
  for (const release of getSortedVersions(availableReleases)) {
    const jsonTaxonomyContents = await getTaxonomy(release);
    for (const productFamily of jsonTaxonomyContents.items) {
      const productNode = findNodeById(productId, productFamily);
      if (productNode) {
        const productFamilyId = productFamily.id;
        const productName = productNode.label;
        const productDocs = await getDocs({
          query: {
            bool: {
              must: [
                { match_phrase: { 'metadata.platform': 'Cloud' } },
                { match_phrase: { 'metadata.product': productName } },
                { match_phrase: { 'metadata.release': release } },
              ],
              must_not: [{ match: { displayOnLandingPages: 'false' } }],
            },
          },
        });
        const productVersions = getSortedVersions(
          getUniqueInMetadataFields(productDocs, 'version')
        );
        let highestProductVersion = productVersions[0];
        if (productVersion) {
          highestProductVersion = productVersions.filter(
            ver => ver === productVersion
          )[0];
        }
        if (highestProductVersion) {
          return `/cloudProducts/${release}/${productFamilyId}/${productId}/${highestProductVersion}`;
        }
      }
    }
  }
  const jsonSelfManagedTaxonomyFileContents = await getTaxonomy();
  const productNode = findNodeById(
    productId,
    jsonSelfManagedTaxonomyFileContents
  );
  if (productNode) {
    const productName = productNode.label;
    const productDocs = await getDocs({
      query: {
        bool: {
          must: [
            { match_phrase: { 'metadata.platform': 'Self-managed' } },
            { match_phrase: { 'metadata.product': productName } },
          ],
          must_not: [{ match: { displayOnLandingPages: 'false' } }],
        },
      },
    });
    const productVersions = getSortedVersions(
      getUniqueInMetadataFields(productDocs, 'version')
    );
    let highestProductVersion = productVersions[0];
    if (productVersion) {
      highestProductVersion = productVersions.filter(
        ver => ver === productVersion
      )[0];
    }
    if (highestProductVersion) {
      return `/selfManagedProducts/${productId}/${highestProductVersion}`;
    }
  }
}

module.exports = {
  findProductRoute,
};
