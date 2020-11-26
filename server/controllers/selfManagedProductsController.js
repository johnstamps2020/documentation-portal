const { getConfig, getTaxonomy } = require('./configController');
const {
  getUniqueInMetadataFields,
  getUniqueInMetadataArrays,
  getSortedVersions,
  resolveUrl,
} = require('./helpers/metadata');
const { getDefaultSubjectIcon, getSubjectIcon } = require('./helpers/icons');
const { findNodeById, getDocsForTaxonomy } = require('./helpers/taxonomy');
const fs = require('fs').promises;

async function getSelfManagedDocsFromConfig() {
  const serverConfig = await getConfig();
  const docs = serverConfig.docs;
  return docs.filter(
    doc =>
      doc.metadata.platform.includes('Self-managed') &&
      doc.displayOnLandingPages !== false
  );
}

async function getSelfManagedDocumentationPageInfo() {
  try {
    const selfManagedDocs = await getSelfManagedDocsFromConfig();
    const selfManagedTaxonomy = await getTaxonomy();
    const pageTitle = selfManagedTaxonomy.label;
    const docs = [];
    getDocsForTaxonomy(selfManagedTaxonomy, selfManagedDocs, docs);
    const categories = [];
    for (const category of selfManagedTaxonomy.items.filter(i => i.items)) {
      const categoryGroups = category.items.filter(i => i.items);
      const categoryDocs = category.items.filter(i => !i.items);

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
          return `/selfManagedProducts/${productId}/${highestProductVersion}`;
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
          label: category.label,
          groups: categoryGroupsWithLinks,
          docs: categoryDocsWithLinks,
        });
      }
    }

    const selfManagedDocumentationPageInfo = {
      title: pageTitle,
      categories: categories,
    };

    return selfManagedDocumentationPageInfo;
  } catch (err) {
    console.log(err);
  }
}

async function getProductPageInfo(productId, productVersion) {
  try {
    const selfManagedDocs = await getSelfManagedDocsFromConfig();
    const selfManagedTaxonomy = await getTaxonomy();
    const productNode = findNodeById(productId, selfManagedTaxonomy);
    const productName = productNode.label;
    const productDocs = selfManagedDocs.filter(
      d =>
        d.metadata.product.includes(productName) &&
        d.metadata.version === productVersion &&
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
      breadcrumb: [{ href: '/', label: 'Self-managed documentation' }],
      selectedVersion: productVersion,
      sortedVersions: getSortedVersions(availableVersions),
    };

    return productPageInfo;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getSelfManagedDocumentationPageInfo,
  getProductPageInfo,
};
