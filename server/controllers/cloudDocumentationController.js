const getConfig = require('./configController');
const cloudTaxonomy = require('../../.teamcity/config/taxonomy/cloud.json');

function getLinks(node, docs, aggregator) {
    if (typeof node === 'string') {
    }
}

async function getCloudHomePage() {
    try {
        // const serverConfig = await getConfig();
        // const docs = serverConfig.docs;
        // const cloudDocs = docs.filter(doc => doc.metadata.platform.includes("Cloud"))

        const pageTitle = Object.keys(cloudTaxonomy)[0];
        const productFamilies = cloudTaxonomy[pageTitle].map(p => getLinks(p));

        const cloudHomePage = {
            "title": pageTitle,
            "productFamilies": productFamilies
        }

        console.log(JSON.stringify(cloudHomePage, null, 4))
    } catch (err) {
        console.log(err)
    }
}

getCloudHomePage().then(r => r);

