const getConfig = require('./configController');
const {
  getUniqueInMetadataFields,
  getUniqueInMetadataArrays,
  getSortedVersions,
} = require('../routes/helpers/metadata');
const fs = require('fs').promises;
const path = require('path');

async function getCloudDocsFromConfig() {
  const serverConfig = await getConfig();
  const docs = serverConfig.docs;
  return docs.filter(
    doc =>
      doc.metadata.platform.includes('Cloud') &&
      doc.displayOnLandingPages !== false
  );
}

async function getTaxonomyFromFile(release) {
  const taxonomyFileContents = await fs.readFile(
    `${__dirname}/../../.teamcity/config/taxonomy/cloud/${release}.json`,
    'utf-8'
  );
  return JSON.parse(taxonomyFileContents);
}

function containsId(idValue, node) {
  if (node.id === idValue) {
    return true;
  }
  if (node.items) {
    for (const child of node.items) {
      if (containsId(idValue, child)) {
        return true;
      }
    }
  }
}

async function getReleasesFromTaxonomyFiles(filterId) {
  const taxonomyFiles = await fs.readdir(
    `${__dirname}/../../.teamcity/config/taxonomy/cloud`
  );
  const availableReleases = [];
  for (const file of taxonomyFiles.filter(f => f.endsWith('.json'))) {
    const release = path.basename(file, '.json');
    if (!filterId) {
      availableReleases.push(release);
    } else {
      const taxonomyFromFile = await getTaxonomyFromFile(release);
      if (containsId(filterId, taxonomyFromFile)) {
        availableReleases.push(release);
      }
    }
  }
  return availableReleases;
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
    const cloudTaxonomy = await getTaxonomyFromFile(release);
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
          link: `${release}/${productFamily.id}`,
        });
      }
    }

    return {
      title: pageTitle,
      productFamilies: productFamilies,
      availableReleases: await getReleasesFromTaxonomyFiles(),
    };
  } catch (err) {
    console.log(err);
  }
}

async function getProductFamilyPageInfo(release, productFamilyId) {
  try {
    const cloudDocs = await getCloudDocsFromConfig();
    const cloudDocsForRelease = cloudDocs.filter(d =>
      d.metadata.release.includes(release)
    );
    const cloudTaxonomy = await getTaxonomyFromFile(release);
    const productFamily = cloudTaxonomy.items.find(
      i => i.id === productFamilyId
    );
    const docs = [];
    getDocsForTaxonomy(productFamily, cloudDocsForRelease, docs);
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
        availableReleases: await getReleasesFromTaxonomyFiles(productFamilyId),
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
