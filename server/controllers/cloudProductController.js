const getConfig = require('./configController');

async function getCloudProducts() {
  try {
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
              existingFamily.href = `products/${existingFamily.id}`;
              existingFamily.docs.push(doc);
            } else {
              cloudProductFamilies.push({
                id: productFamily.toLowerCase().replace(/\W/g, '-'),
                name: productFamily,
                href: doc.url,
                docs: [doc],
              });
            }
          }
        } else {
          console.log('This doc does not have a product family', doc);
        }
      }
    }

    return cloudProductFamilies;
  } catch (err) {
    console.log(err);
  }
}

module.exports = getCloudProducts;
