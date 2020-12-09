const {
  getConfig,
  getTaxonomy,
  getReleasesFromTaxonomies,
} = require('./configController');
const {
  getUniqueInMetadataFields,
  getUniqueInMetadataArrays,
  getSortedVersions,
  resolveUrl,
} = require('./helpers/metadata');
const { getDefaultSubjectIcon, getSubjectIcon } = require('./helpers/icons');
const { findNodeById, getDocsForTaxonomy } = require('./helpers/taxonomy');

const cloudProductsEndpoint = '/cloudProducts';

async function getCloudDocsFromConfig() {
  const serverConfig = await getConfig();
  const docs = serverConfig.docs;
  return docs.filter(
    doc =>
      doc.metadata.platform.includes('Cloud') &&
      doc.displayOnLandingPages !== false
  );
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
    const releaseTaxonomy = await getTaxonomy(release);
    const pageTitle = releaseTaxonomy.label;
    const productFamilies = [];
    for (const productFamily of releaseTaxonomy.items) {
      const docs = [];
      getDocsForTaxonomy(productFamily, cloudDocsForRelease, docs);
      if (docs.length > 1 && productFamily.items.length > 1) {
        productFamilies.push({
          label: productFamily.label,
          url: `${cloudProductsEndpoint}/${release}/${productFamily.id}`,
        });
      } else if (docs.length >= 1) {
        productFamilies.push({
          label: productFamily.label,
          url: resolveUrl(docs[0].url),
        });
      }
    }

    const cloudDocumentationPageInfo = {
      title: pageTitle,
      productFamilies: productFamilies,
      selectedRelease: release,
      availableReleases: await getReleasesFromTaxonomies(),
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
    const releaseTaxonomy = await getTaxonomy(release);
    const productFamilyNode = findNodeById(productFamilyId, releaseTaxonomy);
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
          const highestProductVersion = getSortedVersions(
            getUniqueInMetadataFields(listOfDocs, 'version')
          )[0];
          const docsForHighestVersion = listOfDocs.filter(
            d =>
              d.metadata.version === highestProductVersion &&
              d.displayOnLandingPages !== false
          );
          if (docsForHighestVersion.length === 1) {
            return resolveUrl(docsForHighestVersion[0]?.url);
          } else if (docsForHighestVersion.length > 1) {
            return `${cloudProductsEndpoint}/${release}/${productFamilyId}/${productId}/${highestProductVersion}`;
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

        if (
          categoryDocsWithLinks.length > 0 ||
          categoryGroupsWithLinks.length > 0
        ) {
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
        breadcrumb: [
          {
            href: `${cloudProductsEndpoint}/${release}`,
            label: `${release} documentation`,
          },
        ],
        selectedRelease: release,
        availableReleases: await getReleasesFromTaxonomies(productFamilyId),
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
    const releaseTaxonomy = await getTaxonomy(release);
    const productFamilyNode = findNodeById(productFamilyId, releaseTaxonomy);
    const productFamilyName = productFamilyNode.label;
    const productNode = findNodeById(productId, productFamilyNode);
    const productName = productNode.label;
    const productDocs = cloudDocs.filter(
      d =>
        d.metadata.release.includes(release) &&
        d.metadata.product.includes(productName) &&
        d.displayOnLandingPages !== false
    );
    const docsInVersion = productDocs.filter(
      d => d.metadata.version === productVersion
    );

    const docSubjectsInVersion = getUniqueInMetadataArrays(
      docsInVersion,
      'subject'
    );
    let docsWithSubject = [];
    for (const subject of docSubjectsInVersion) {
      const docsInSubject = docsInVersion.filter(d =>
        d.metadata.subject.includes(subject)
      );
      if (docsInSubject.length > 0) {
        docsWithSubject.push({
          subjectName: subject,
          subjectDocs: docsInSubject.map(d => ({
            ...d,
            url: resolveUrl(d.url),
          })),
          subjectIcon: getSubjectIcon(subject),
        });
      }
    }

    const docsWithoutSubject = docsInVersion.filter(d => !d.metadata.subject);
    if (docsWithoutSubject && docsWithoutSubject.length > 0) {
      docsWithSubject.push({
        subjectName: 'Documents',
        subjectDocs: docsWithoutSubject.map(d => ({
          ...d,
          url: resolveUrl(d.url),
        })),
        subjectIcon: getDefaultSubjectIcon(),
      });
    }
    const availableVersions = getUniqueInMetadataFields(productDocs, 'version');
    const productPageInfo = {
      title: `${productName} ${productVersion}`,
      subjects: docsWithSubject,
      breadcrumb: [
        { href: `${cloudProductsEndpoint}`, label: 'Cloud documentation' },
        { href: `${cloudProductsEndpoint}/${release}`, label: release },
        {
          href: `${cloudProductsEndpoint}/${release}/${productFamilyId}`,
          label: productFamilyName,
        },
      ],
      selectedVersion: productVersion,
      sortedVersions: getSortedVersions(availableVersions),
    };

    return productPageInfo;
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
