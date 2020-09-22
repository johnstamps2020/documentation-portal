exports.getHighestRelease = function(listOfReleases) {
  const releasesFromNewest = ['Banff', 'Aspen'];

  for (const releaseName of releasesFromNewest) {
    if (listOfReleases.includes(releaseName)) {
      return releaseName;
    }
  }
};

exports.getUniqueInMetadataArrays = function(listOfDocs, fieldName) {
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
};

exports.getUniqueInMetadataFields = function(listOfDocs, fieldName) {
  let availableValues = [];
  for (const doc of listOfDocs) {
    const value = doc.metadata[fieldName];
    if (value && !availableValues.includes(value)) {
      availableValues.push(value);
    }
  }

  return availableValues;
};

exports.getSortedVersions = function(listOfVersions) {
  const sortedVersions = listOfVersions.sort(
    (a,b) => a.replace(/\d+/g, n => +n+100).localeCompare(b.replace(/\d+/g, n => +n+100))).reverse();
  
  return sortedVersions;
}
