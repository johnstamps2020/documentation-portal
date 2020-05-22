const config = require('../config.json');

const cloudProducts = config.docs
  .map(doc => {
    if (doc.metadata.platform.toLowerCase() === 'cloud') {
      return doc.metadata.productFamily;
    }
  })
  .filter(Boolean);
const flatList = cloudProducts.concat.apply([], cloudProducts);
const uniqueProducts = new Set(flatList);

let cloudProductFamilies = [];
uniqueProducts.forEach(uniqueProduct => {
  cloudProductFamilies.push({
    name: uniqueProduct,
    href: uniqueProduct.toLowerCase().replace(/ /g, '-'),
  });
});

module.exports = cloudProductFamilies;
