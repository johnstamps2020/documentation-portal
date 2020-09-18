const getConfig = require('./configController');

async function getCloudProductFamilies() {
  try {
    const config = await getConfig();
    let cloudProductFamilies = [];

    for (const productFamily of config.productFamilies) {
      
      if (productFamily.products.length > 0) {
        for (const doc of config.docs) {
          if (doc.metadata.products && doc.metadata.platform && doc.metadata.platform.includes('Cloud')) {
            if (doc.metadata.products.some(r => productFamily.products.includes(r))) {
              const existingFamily = cloudProductFamilies.find(
                f => f.name === productFamily.productFamilyName
              );
              if (existingFamily) {
                existingFamily.href = `products/${existingFamily.id}`;
                existingFamily.docs.push(doc);
              } else {
                cloudProductFamilies.push({
                  id: productFamily.productFamilyName.toLowerCase().replace(/\W/g, '-'),
                  name: productFamily.productFamilyName,
                  href: doc.url,
                  docs: [doc],
                });
              }
            }
          }
        }
      }
    }

    return cloudProductFamilies;
  } catch (err) {
    console.log(err);
  }
}

module.exports = getCloudProductFamilies;
