function findNodeById(idValue, node) {
  if (node.id === idValue) {
    return node;
  }
  if (node.items) {
    for (const child of node.items) {
      const result = findNodeById(idValue, child);
      if (result) {
        return result;
      }
    }
  }
}

function getDocsForTaxonomy(node, docsFromConfig, matchingDocs) {
  if (!node.items && node.label) {
    if (docsFromConfig.some(d => d.metadata.product.includes(node.label))) {
      const filteredDocs = docsFromConfig.filter(d =>
        d.metadata.product.includes(node.label)
      );
      matchingDocs.push.apply(matchingDocs, filteredDocs);
    }
  } else if (node.items) {
    for (const child of node.items) {
      getDocsForTaxonomy(child, docsFromConfig, matchingDocs);
    }
  }
}

module.exports = { findNodeById, getDocsForTaxonomy };
