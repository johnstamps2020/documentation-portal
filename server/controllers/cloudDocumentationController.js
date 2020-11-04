const getConfig = require('./configController');
const cloudTaxonomy = require('../../.teamcity/config/taxonomy/cloud.json');
const {
  getUniqueInMetadataFields,
  getUniqueInMetadataArrays,
  getSortedVersions,
} = require('../routes/helpers/metadata');

async function getCloudDocsFromConfig() {
  const serverConfig = await getConfig();
  const docs = serverConfig.docs;
  return docs.filter(
    doc =>
      doc.metadata.platform.includes('Cloud') &&
      doc.displayOnLandingPages !== false
  );
}

function getDocsForTaxonomy(node, docsFromConfig, matchingDocs) {
  if (typeof node === 'string') {
    if (docsFromConfig.some(d => d.metadata.product.includes(node))) {
      const filteredDocs = docsFromConfig.filter(d =>
        d.metadata.product.includes(node)
      );
      matchingDocs.push.apply(matchingDocs, filteredDocs);
    }
  } else {
    for (const child of node.items) {
      getDocsForTaxonomy(child, docsFromConfig, matchingDocs);
    }
  }
}

async function getCloudDocumentationPageInfo(release) {
  try {
    const cloudDocs = await getCloudDocsFromConfig();
    const cloudDocsForRelease = cloudDocs.filter(d =>
      d.metadata.release.includes(release)
    );
    const pageTitle = cloudTaxonomy.label;
    const productFamilies = [];
    for (const productFamily of cloudTaxonomy.items) {
      const docs = [];
      getDocsForTaxonomy(productFamily, cloudDocsForRelease, docs);
      if (docs.length === 1) {
        productFamilies.push({
          label: productFamily.label,
          link: docs[0].url,
        });
      } else if (docs.length > 1) {
        productFamilies.push({
          label: productFamily.label,
          link: `${release}/${productFamily.id.toLowerCase()}`,
        });
      }
    }

    return {
      title: pageTitle,
      productFamilies: productFamilies,
      availableReleases: getSortedVersions(
        getUniqueInMetadataArrays(cloudDocs, 'release')
      ),
    };
  } catch (err) {
    console.log(err);
  }
}

async function getProductFamilyPageInfo(productFamilyId) {
  try {
    const cloudDocs = await getCloudDocsFromConfig();
    const productFamily = cloudTaxonomy.items.find(
      i => i.id.toLowerCase() === productFamilyId
    );
    const docs = [];
    getDocsForTaxonomy(productFamily, cloudDocs, docs);
    if (docs) {
      const categories = [];
      for (const productFamilyItem of productFamily.items.filter(
        i => typeof i !== 'string'
      )) {
        const categoryGroups = productFamilyItem.items.filter(
          i => typeof i !== 'string'
        );
        const categoryDocs = productFamilyItem.items.filter(
          i => typeof i === 'string'
        );

        function getDocUrl(listOfDocs, productName) {
          if (listOfDocs.length === 1) {
            return `/${listOfDocs[0]?.url}`;
          } else if (listOfDocs.length > 1) {
            const version = getSortedVersions(
              getUniqueInMetadataFields(listOfDocs, 'version')
            )[0];
            return `cloud/${productName}/${version}`;
          }
        }

        const categoryDocsWithLinks = [];
        for (const categoryDoc of categoryDocs) {
          const docsFromConfig = docs.filter(doc =>
            doc.metadata.product.includes(categoryDoc)
          );
          if (docsFromConfig) {
            const docUrl = getDocUrl(docsFromConfig, categoryDoc);
            if (docUrl) {
              categoryDocsWithLinks.push({
                docLabel: categoryDoc,
                docUrl: docUrl,
              });
            }
          }
        }
        const categoryGroupsWithLinks = [];
        for (const categoryGroup of categoryGroups) {
          const categoryGroupDocs = categoryGroup.items.filter(
            i => typeof i === 'string'
          );
          const categoryGroupDocsWithLinks = [];
          for (const categoryGroupDoc of categoryGroupDocs) {
            const docsFromConfig = docs.filter(doc =>
              doc.metadata.product.includes(categoryGroupDoc)
            );
            if (docsFromConfig) {
              const docUrl = getDocUrl(docsFromConfig, categoryGroupDoc);
              if (docUrl) {
                categoryGroupDocsWithLinks.push({
                  docLabel: categoryGroupDoc,
                  docUrl: docUrl,
                });
              }
            }
          }
          categoryGroupsWithLinks.push({
            groupLabel: categoryGroup.label,
            groupDocs: categoryGroupDocsWithLinks,
          });
        }

        categories.push({
          label: productFamilyItem.label,
          groups: categoryGroupsWithLinks,
          docs: categoryDocsWithLinks,
        });
      }
      return {
        title: productFamily.label,
        categories: categories,
        availableReleases: getSortedVersions(
          getUniqueInMetadataArrays(docs, 'release')
        ),
      };
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getCloudDocumentationPageInfo,
  getProductFamilyPageInfo,
};
