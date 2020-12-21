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

function resolveUrl(url) {
  /**
   * If you provide a relative URL without the base, new URL() throws a TypeError.
   * This way, you can check if the URL is absolute or relative.
   */
  let resolvedUrl;
  try {
    new URL(url);
    resolvedUrl = url;
  } catch (err) {
    if (err instanceof TypeError) {
      resolvedUrl = `/${url}`;
    }
  } finally {
    return resolvedUrl;
  }
}

function isPublic(arrayOfDocs) {
  return arrayOfDocs.some(d => d.public);
}

module.exports = {
  getUniqueInMetadataArrays,
  getUniqueInMetadataFields,
  getSortedVersions,
  resolveUrl,
  isPublic,
};
