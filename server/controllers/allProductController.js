const getConfig = require('./configController');
const {
    getUniqueInMetadataArrays,
    getUniqueInMetadataFields
} = require('../routes/helpers/metadata');

async function getAllProductDocs() {
  try {
    const config = await getConfig();
    const docs = config.docs;
    const allProducts = getUniqueInMetadataArrays(docs, 'product');
    let allProductDocs = [];
    for (const productName of allProducts) {
        let productDocs = [];
        for (const doc of config.docs) {
            if(doc.metadata.product && doc.metadata.product.includes(productName)) {
                productDocs.push(doc);
            }
        }
        allProductDocs.push({
            id: productName.toLowerCase().replace(/\W/g, '-'),
            name: productName,
            docs: productDocs
        })
    }

    return allProductDocs;
  } catch (err) {
    console.log(err);
  }
}

module.exports = getAllProductDocs;
