const getConfig = require('./configController');

async function getCloudProductFamilies() {
  try {
    const config = await getConfig();
    let cloudProductFamilies = [];

    for (const productFamily of config.productFamilies) {
      const productFamilyProducts = productFamily.product;
      if (productFamilyProducts.length > 0) {
        for (const doc of config.docs) {
          const docProducts = doc.metadata.product;
          const docPlatforms = doc.metadata.platform;
          if (docProducts && docPlatforms && docPlatforms.includes('Cloud')) {
            if (docProducts.some(r => productFamilyProducts.includes(r))) {
              // copy doc values to new object and remove products from clone that are not in productFamily
              let docToAdd = JSON.parse(JSON.stringify(doc));
              let filteredProducts = [];
              filteredProducts = docToAdd.metadata.product.filter(product =>
                productFamily.product.includes(product)
              );
              docToAdd.metadata.product = filteredProducts;

              const existingFamily = cloudProductFamilies.find(
                f => f.name === productFamily.productFamilyName
              );
              if (existingFamily) {
                existingFamily.href = `products/${existingFamily.id}`;
                existingFamily.docs.push(docToAdd);
              } else {
                cloudProductFamilies.push({
                  id: productFamily.productFamilyName
                    .toLowerCase()
                    .replace(/\W/g, '-'),
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
