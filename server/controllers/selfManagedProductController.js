const getConfig = require('./configController');

const {
  getUniqueInMetadataArrays,
  getUniqueInMetadataFields,
  getSortedVersions
} = require('../routes/helpers/metadata');

async function getSelfManagedProducts() {
  try {
    const config = await getConfig();
    const docs = config.docs;
    let selfManagedProducts = [];
    let categories = docs.reduce((r, a) => {
      if (a.metadata.platform.includes('Self-managed')) {
        r[a.metadata.category] = [...(r[a.metadata.category] || []), a];
      }
      return r;
    }, {});
    const categoryArray = Object.entries(categories);
    categoryArray.forEach(group => {
      const categoryName = group[0];
      const categoryItems = group[1];

      const products = categoryItems.reduce((r, a) => {
        r[a.metadata.product] = [...(r[a.metadata.product] || []), a];
        return r;
      }, {});
      const productArray = Object.entries(products);
      let productsInCategory = [];
      productArray.forEach(product => {
        const productReleases = product[1].filter(doc => doc.visible !== false);
        const docsSortedFromLatestToOldest = productReleases.sort((a, b) =>
          a.metadata.version.replace(/\d+/g, n => +n+100).localeCompare(b.metadata.version.replace(/\d+/g, n => +n+100))).reverse();

        if (docsSortedFromLatestToOldest.length > 0) {
          productsInCategory.push({
            productName: product[0],
            productDocs: docsSortedFromLatestToOldest,
          });
        }
      });
      selfManagedProducts.push({
        categoryName: categoryName,
        categoryItems: productsInCategory,
      });
    });

    return selfManagedProducts;
  } catch (err) {
    console.log(err);
  }
}

module.exports = getSelfManagedProducts;
