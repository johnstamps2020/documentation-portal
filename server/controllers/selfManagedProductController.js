const config = require('../config.json');

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
    const excludedProducts = new RegExp(
      '(BillingCenter|ClaimCenter|PolicyCenter) Upgrade Tools'
    );
    const productReleases = product[1].filter(
      doc =>
        doc.visible !== false &&
        !doc.metadata.product.some(e => excludedProducts.test(e))
    );
    const docsSortedFromLatestToOldest = productReleases.sort((a, b) =>
      parseInt(a.metadata.version) > parseInt(b.metadata.version) ? -1 : 1
    );

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

module.exports = selfManagedProducts;
