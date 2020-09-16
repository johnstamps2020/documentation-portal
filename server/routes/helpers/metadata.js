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

exports.getHighestVersion = function(listOfVersions) {
  if (listOfVersions.includes('latest')) {
    return 'latest';
  }

  const versionNumbers = listOfVersions.map(v => parseFloat(v));
  const highestVersionNumber = Math.max(...versionNumbers);
  const highestVersion = listOfVersions.find(
    p => parseFloat(p) === highestVersionNumber
  );

  return highestVersion;
};
