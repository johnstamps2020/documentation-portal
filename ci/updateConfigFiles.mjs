import { readdirSync, readFileSync, writeFileSync } from 'fs';

const configRoot = `${process.cwd()}/.teamcity`;

function getFilePathsRecursively(dir) {
  const dirEntities = readdirSync(dir, { withFileTypes: true });
  const files = dirEntities
    .map((dirEntity) => {
      if (dirEntity.isDirectory()) {
        return getFilePathsRecursively(`${dir}/${dirEntity.name}`);
      }
      return `${dir}/${dirEntity.name}`;
    })
    .flat();
  return files;
}

function getCurrentOrDefaultValue(doc, propName, defaultValue) {
  const matchingProp = doc[propName];
  if (matchingProp === undefined) {
    return defaultValue;
  }
  return matchingProp;
}

function addMissingProps(configObject) {
  return {
    ...configObject,
    docs: configObject.docs.map((doc) => ({
      ...doc,
      displayOnLandingPages: getCurrentOrDefaultValue(
        doc,
        'displayOnLandingPages',
        true
      ),
      indexForSearch: getCurrentOrDefaultValue(doc, 'indexForSearch', true),
    })),
  };
}

const configFilePaths = getFilePathsRecursively(configRoot).filter((file) => {
  return file.endsWith('.json');
});

for (const filePath of configFilePaths) {
  const fileContents = readFileSync(filePath, 'utf8');
  const configObject = JSON.parse(fileContents);

  if (configObject.docs) {
    console.log(`Updating doc config in file ${filePath}`);
    const updatedConfigObject = addMissingProps(configObject);
    writeFileSync(
      filePath,
      JSON.stringify(updatedConfigObject, null, 2),
      'utf8'
    );
  }
}
