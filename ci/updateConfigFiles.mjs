import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

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

function addMissingDocProps(configObject) {
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

function addMissingBuildProps(configObject, filePath) {
  return {
    ...configObject,
    builds: configObject.builds.map((build) => ({
      ...build,
      disabled: filePath.includes('archive')
        ? true
        : getCurrentOrDefaultValue(configObject, 'disabled', false),
    })),
  };
}

function updateConfigObjectAndSave(configObject, filePath, updateFunction) {
  const updatedConfigObject = updateFunction(configObject, filePath);
  if (JSON.stringify(updatedConfigObject) !== JSON.stringify(configObject)) {
    console.log(`Updating config in file ${filePath}`);
    writeFileSync(
      filePath,
      JSON.stringify(updatedConfigObject, null, 2),
      'utf8'
    );
  }
}

function runUpdateOnAll() {
  const configFilePaths = getFilePathsRecursively(configRoot).filter((file) => {
    return file.endsWith('.json');
  });

  for (const filePath of configFilePaths) {
    const fileContents = readFileSync(filePath, 'utf8');
    const configObject = JSON.parse(fileContents);

    if (configObject.docs) {
      updateConfigObjectAndSave(configObject, filePath, addMissingDocProps);
    }

    if (configObject.builds) {
      updateConfigObjectAndSave(configObject, filePath, addMissingBuildProps);
    }
  }
}

runUpdateOnAll();
