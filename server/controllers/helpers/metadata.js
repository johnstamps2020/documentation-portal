function getUniqueInMetadataArrays(listOfDocs, fieldName) {
  let availableValues = [];
  for (const doc of listOfDocs) {
    const values = doc.metadata[fieldName];
    if (values) {
      for (const value of values) {
        if (!availableValues.includes(value)) {
          availableValues.push(value);
        }
      }
    }
  }

  return availableValues;
}

function getUniqueInMetadataFields(listOfDocs, fieldName) {
  let availableValues = [];
  for (const doc of listOfDocs) {
    const value = doc.metadata[fieldName];
    if (value && !availableValues.includes(value)) {
      availableValues.push(value);
    }
  }

  return availableValues;
}

function getSortedVersions(listOfVersions) {
  const sortedVersions = listOfVersions
    .sort((a, b) =>
      a
        .replace(/\d+/g, n => +n + 100)
        .localeCompare(b.replace(/\d+/g, n => +n + 100))
    )
    .reverse();

  return sortedVersions;
}

module.exports = {
  getUniqueInMetadataArrays,
  getUniqueInMetadataFields,
  getSortedVersions,
};
