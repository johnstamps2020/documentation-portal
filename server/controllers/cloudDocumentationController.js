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

function findNodeById(idValue, node) {
  if (node.id === idValue) {
    return node;
  }
  if (node.items) {
    for (const child of node.items) {
      const result = findNodeById(idValue, child);
      if (result) {
        return result;
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
      if (findNodeById(filterId, taxonomyFromFile)) {
        availableReleases.push(release);
      }
    }
  }
  return availableReleases;
}

function getDocsForTaxonomy(node, docsFromConfig, matchingDocs) {
  if (!node.items && node.label) {
    if (docsFromConfig.some(d => d.metadata.product.includes(node.label))) {
      const filteredDocs = docsFromConfig.filter(d =>
        d.metadata.product.includes(node.label)
      );
      matchingDocs.push.apply(matchingDocs, filteredDocs);
    }
  } else if (node.items) {
    for (const child of node.items) {
      getDocsForTaxonomy(child, docsFromConfig, matchingDocs);
    }
  }
}

async function getHighestCloudRelease() {
  try {
    const serverConfig = await getConfig();
    const docs = serverConfig.docs.filter(
      doc =>
        doc.metadata.platform.includes('Cloud') &&
        doc.displayOnLandingPages !== false
    );
    const highestCloudRelease = getSortedVersions(
      getUniqueInMetadataArrays(docs, 'release')
    )[0];
    return highestCloudRelease;
  } catch (err) {
    console.log(err);
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

    const cloudDocumentationPageInfo = {
      title: pageTitle,
      productFamilies: productFamilies,
      availableReleases: await getReleasesFromTaxonomyFiles(),
    };

    return cloudDocumentationPageInfo;
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
    const productFamilyNode = findNodeById(productFamilyId, cloudTaxonomy);
    const docs = [];
    getDocsForTaxonomy(productFamilyNode, cloudDocsForRelease, docs);
    if (docs) {
      const categories = [];
      for (const productFamilyItem of productFamilyNode.items.filter(
        i => i.items
      )) {
        const categoryGroups = productFamilyItem.items.filter(i => i.items);
        const categoryDocs = productFamilyItem.items.filter(i => !i.items);

        function getDocUrl(listOfDocs, productId) {
          if (listOfDocs.length === 1) {
            return `/${listOfDocs[0]?.url}`;
          } else if (listOfDocs.length > 1) {
            const version = getSortedVersions(
              getUniqueInMetadataFields(listOfDocs, 'version')
            )[0];
            return `/${release}/${productFamilyId}/${productId}/${version}`;
          }
        }

        const categoryDocsWithLinks = [];
        for (const categoryDoc of categoryDocs) {
          const docsFromConfig = docs.filter(doc =>
            doc.metadata.product.includes(categoryDoc.label)
          );
          if (docsFromConfig) {
            const docUrl = getDocUrl(docsFromConfig, categoryDoc.id);
            if (docUrl) {
              categoryDocsWithLinks.push({
                docLabel: categoryDoc.label,
                docUrl: docUrl,
              });
            }
          }
        }
        const categoryGroupsWithLinks = [];
        for (const categoryGroup of categoryGroups) {
          const categoryGroupDocs = categoryGroup.items.filter(i => !i.items);
          const categoryGroupDocsWithLinks = [];
          for (const categoryGroupDoc of categoryGroupDocs) {
            const docsFromConfig = docs.filter(doc =>
              doc.metadata.product.includes(categoryGroupDoc.label)
            );
            if (docsFromConfig) {
              const docUrl = getDocUrl(docsFromConfig, categoryGroupDoc.id);
              if (docUrl) {
                categoryGroupDocsWithLinks.push({
                  docLabel: categoryGroupDoc.label,
                  docUrl: docUrl,
                });
              }
            }
          }
          if (categoryGroupDocsWithLinks.length > 0) {
            categoryGroupsWithLinks.push({
              groupLabel: categoryGroup.label,
              groupDocs: categoryGroupDocsWithLinks,
            });
          }
        }

        if (categoryDocsWithLinks.length > 0) {
          categories.push({
            label: productFamilyItem.label,
            groups: categoryGroupsWithLinks,
            docs: categoryDocsWithLinks,
          });
        }
      }
      const productFamilyPageInfo = {
        title: productFamilyNode.label,
        categories: categories,
        availableReleases: await getReleasesFromTaxonomyFiles(productFamilyId),
      };

      return productFamilyPageInfo;
    }
  } catch (err) {
    console.log(err);
  }
}

async function getProductPageInfo(
  release,
  productFamilyId,
  productId,
  productVersion
) {
  try {
    const cloudDocs = await getCloudDocsFromConfig();
    //Find the right product ID in the taxonomy
    //Filter the doc list based on release, product, version
    const cloudTaxonomy = await getTaxonomyFromFile(release);
    const productFamilyNode = findNodeById(productFamilyId, cloudTaxonomy);
    const productName = findNodeById(productId, productFamilyNode).label;
    const docs = [];
    const docsInProduct = cloudDocs.filter(
      d =>
        d.metadata.release.includes(release) &&
        d.metadata.product.includes(productName) &&
        d.metadata.version === productVersion &&
        d.displayOnLandingPages !== false
    );
    const availableVersions = getUniqueInMetadataFields(
      docsInProduct,
      'version'
    );

    const sortedVersions = getSortedVersions(availableVersions);

    const docsInVersion = docsInProduct.filter(
      d => d.metadata.version === version
    );

    let docsBySubject = [];
    const availableSubjects = getUniqueInMetadataArrays(
      docsInVersion,
      'subject'
    );
    for (const subject of availableSubjects) {
      docsInSubject = docsInVersion.filter(d =>
        d.metadata.subject.includes(subject)
      );
      if (docsInSubject.length > 0) {
        docsBySubject.push({
          category: subject,
          docs: docsInSubject,
          icon: getSubjectIcon(subject),
        });
      }
    }

    const docsWithoutSubject = docsInVersion.filter(d => !d.metadata.subject);

    if (docsWithoutSubject && docsWithoutSubject.length > 0) {
      docsBySubject.push({
        category: 'Documents',
        docs: docsWithoutSubject,
        icon: getDefaultSubjectIcon(),
      });
    }

    if (docsBySubject.length === 1 && docsBySubject[0].docs.length === 1) {
      res.redirect('/' + docsBySubject[0].docs[0].url);
    } else {
      res.render('grouped-links', {
        title: `${product} ${version}`,
        docGroups: docsBySubject,
        breadcrumb: [
          { href: `/`, label: 'Cloud documentation' },
          { href: `/products/${productFamilyId}`, label: productFamily.name },
          { href: `/products/${productFamilyId}/${release}`, label: release },
        ],
        selectedRelease: version,
        sortedVersions: sortedVersions,
      });
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getHighestCloudRelease,
  getCloudDocumentationPageInfo,
  getProductFamilyPageInfo,
  getProductPageInfo,
};
