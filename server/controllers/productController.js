const getConfig = require('./configController');

async function getProduct(productName, docVersion) {
  try {
    console.log(
      'LOOKING FOR PRODUCT',
      `name: ${productName}, version: ${docVersion}`
    );
    const config = await getConfig();
    let product = {
      name: productName,
      version: docVersion,
      url: '',
      docs: [],
    };

    const matchingDocs = config.docs.filter(
      d =>
        d.metadata.product.includes(productName) &&
        d.metadata.version === docVersion
    );

    console.log('FOUND', matchingDocs);

    if (matchingDocs && matchingDocs.length > 1) {
      const docs = matchingDocs.reduce((r, a) => {
        r[a.metadata.category] = [...(r[a.metadata.category] || []), a];
        return r;
      }, {});
      product.url = `${productName}/${docVersion}`;
      product.docs = docs;
    } else if (matchingDocs && matchingDocs.length === 1) {
      const categoryName = matchingDocs[0].metadata.category;
      console.log('We found one doc and we are in the right if block');
      product.url = matchingDocs[0].url;
      product.docs = [{ [categoryName]: [matchingDocs] }];
    } else {
      return undefined;
    }

    return product;
  } catch (err) {
    console.log(err);
  }
}

module.exports = getProduct;
