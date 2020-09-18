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
              // copy doc values to new object and remove products from clone that are not in productFamily
              let docToAdd = JSON.parse(JSON.stringify(doc));
              let filteredProducts = [];
              filteredProducts = docToAdd.metadata.products.filter(product => productFamily.products.includes(product));              
              docToAdd.metadata.products = filteredProducts;

              const existingFamily = cloudProductFamilies.find(
                f => f.name === productFamily.productFamilyName
              );
              if (existingFamily) {
                existingFamily.href = `products/${existingFamily.id}`;
                existingFamily.docs.push(docToAdd);
              } else {
                cloudProductFamilies.push({
                  id: productFamily.productFamilyName.toLowerCase().replace(/\W/g, '-'),
                  name: productFamily.productFamilyName,
                  href: docToAdd.url,
                  docs: [docToAdd],
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
