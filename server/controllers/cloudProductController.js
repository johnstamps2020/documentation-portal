const config = require('../config.json');

const cloudProducts = config.docs
  .map(doc => {
    if (doc.metadata.platform.toLowerCase() === 'cloud') {
      return doc.metadata.product;
    }
  })
  .filter(Boolean);
const flatList = cloudProducts.concat.apply([], cloudProducts);
const uniqueProducts = new Set(flatList);

let cloudProductList = [];
uniqueProducts.forEach(uniqueProduct => {
  cloudProductList.push({
    name: uniqueProduct,
    href: uniqueProduct.toLowerCase().replace(/ /g, '-'),
  });
});

module.exports = cloudProductList;
