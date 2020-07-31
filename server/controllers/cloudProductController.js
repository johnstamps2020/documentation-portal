const getConfig = require('./configController');

async function getCloudProducts() {
  const config = await getConfig();
  let cloudProductFamilies = [];
  for (const doc of config.docs) {
    if (doc.metadata.platform && doc.metadata.platform.includes('Cloud')) {
      if (doc.metadata.productFamily) {
        for (const productFamily of doc.metadata.productFamily) {
          const existingFamily = cloudProductFamilies.find(
            f => f.name === productFamily
          );
          if (existingFamily) {
            // const productDocs = config.docs.reduce((r, doc) => {
            //   if (
            //     doc.metadata.platform.includes('Cloud') &&
            //     doc.metadata.productFamily &&
            //     doc.metadata.productFamily.includes(productFamily.name) &&
            //     (doc.visible === undefined || doc.visible)
            //   ) {
            //     r[doc.metadata.category] = [
            //       ...(r[doc.metadata.category] || []),
            //       doc,
            //     ];
            //   }
            //   return r;
            // }, {});

            existingFamily.href = `products/${existingFamily.id}`;
            existingFamily.docs.push(doc);
            console.log(existingFamily);
          } else {
            cloudProductFamilies.push({
              id: productFamily.toLowerCase().replace(/\W/g, '-'),
              name: productFamily,
              href: doc.url,
              docs: [ doc ]
            });
          }
        }
      } else {
        console.log('This doc does not have a product family', doc);
      }
    }
  }

  return cloudProductFamilies;
}

module.exports = getCloudProducts;
