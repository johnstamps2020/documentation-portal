const config = require('../config.json');

let cloudProductFamilies = [];
for (const doc of config.docs) {
  if (
    doc.metadata.platform &&
    doc.metadata.platform.toLowerCase() === 'cloud'
  ) {
    if (doc.metadata.productFamily) {
      for (const productFamily of doc.metadata.productFamily) {
        const existingFamily = cloudProductFamilies.find(
          f => f.name === productFamily
        );
        if (existingFamily) {
          existingFamily.href = `products/${existingFamily.id}`;
        } else {
          cloudProductFamilies.push({
            id: productFamily.toLowerCase().replace(/\W/g, '-'),
            name: productFamily,
            href: doc.url,
          });
        }
      }
    } else {
      console.log('This doc does not have a product family', doc);
    }
  }
}

module.exports = cloudProductFamilies;
