import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { cloneDeep } from 'lodash';
import yaml from 'yaml';

const subfolderName = 'generated';
let totalAbsolvedSins = 0;
let totalNumberOfSavedSpecs = 0;
const verbs = ['post', 'get', 'put', 'patch', 'delete'];

function generateFolderName(str: string) {
  return str.replace(/[^a-zA-Z0-9 ]/g, '');
}

function generateId(str: string) {
  return str.replace('/', '').replace(/[^a-zA-Z]/g, '-');
}

async function createTargetFolderIfNeeded(filePath: string) {
  const dirPath = dirname(filePath);
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

async function writeFileIfNewOrChanged(filePath: string, fileContents: string) {
  let alreadyMatches = false;

  if (existsSync(filePath)) {
    const existingFileContents = readFileSync(filePath, 'utf-8');
    if (existingFileContents === fileContents) {
      alreadyMatches = true;
    }
  }

  if (!alreadyMatches) {
    writeFileSync(filePath, fileContents);
  }
}

async function createMarkdownFile(
  relativePath: string,
  title: string,
  docsDir: string,
  operation: string
) {
  const outputPath = join(docsDir, `${relativePath}.mdx`);
  await createTargetFolderIfNeeded(outputPath);

  const markdownContents = `---
title: ${operation.toUpperCase()} ${title}
hide_table_of_contents: true
hide_title: true
---

import GwRedoc from '@theme/GwRedoc';

<GwRedoc specRelativeUrl="${relativePath}.json" />
`;

  await writeFileIfNewOrChanged(outputPath, markdownContents);
}

function findAllByKey(obj: any, keyToFind: string): any {
  return Object.entries(obj).reduce(
    (acc, [key, value]) =>
      key === keyToFind
        ? acc.concat(value)
        : typeof value === 'object' && value
        ? acc.concat(findAllByKey(value, keyToFind))
        : acc,
    []
  );
}

async function getMatchingRefs(obj: any, pathSegment: string) {
  const all = findAllByKey(obj, '$ref');
  const filtered = all.filter((key: string) =>
    key.split('/').includes(pathSegment)
  );
  const result = filtered.map((key: string) => {
    const fragments = key.split('/');
    const last = fragments[fragments.length - 1];
    return last;
  });

  return result;
}

async function purify(sinner: any, sinName: string) {
  const sinnerCopy = await cloneObject(sinner);
  const allowList = await getMatchingRefs(sinnerCopy, sinName);
  if (!sinnerCopy.components) {
    sinnerCopy.components = {};
  }
  if (allowList.length === 0) {
    sinnerCopy.components[sinName] = {};
  } else {
    if (sinnerCopy['components'][sinName]) {
      const sinfulObject = sinnerCopy['components'][sinName];
      const filtered = Object.keys(sinfulObject)
        .filter((key) => allowList.includes(key))
        .reduce((obj: any, key) => {
          obj[key] = sinfulObject[key];
          return obj;
        }, {});

      const difference =
        Object.keys(sinfulObject).length - Object.keys(filtered).length;
      totalAbsolvedSins = totalAbsolvedSins + difference;
      sinnerCopy['components'][sinName] = filtered;
    }
  }

  return sinnerCopy;
}

async function purifySpec(specObject: any) {
  const cloneOfTheSinner = await cloneObject(specObject);
  const copyWithPureParameters = await purify(cloneOfTheSinner, 'parameters');
  const copyWithPureSchemas = await purify(copyWithPureParameters, 'schemas');

  return copyWithPureSchemas;
}

async function createSpecFile(
  relativePath: string,
  specObject: any,
  staticDir: string
) {
  const outputPath = join(staticDir, `${relativePath}.json`);
  await createTargetFolderIfNeeded(outputPath);

  const purifiedSpec = await purifySpec(specObject);
  await writeFileIfNewOrChanged(outputPath, JSON.stringify(purifiedSpec));
  totalNumberOfSavedSpecs = totalNumberOfSavedSpecs + 1;
}

async function cloneObject(obj: any) {
  const clone = cloneDeep(obj);
  return clone;
}

function getSpecObject(specString: string) {
  try {
    const fromJson = JSON.parse(specString);
    return fromJson;
  } catch (err) {
    try {
      const fromYaml = yaml.parse(specString);
      return fromYaml;
    } catch (finalErr) {
      console.error(finalErr);
      return {};
    }
  }
}

type PurgeExpression = (key: string) => boolean;

function purgeCustomTags(
  property: any,
  expression: PurgeExpression,
  shallow = false
) {
  property &&
    Object.keys(property).map((propertyKey) => {
      if (expression(propertyKey)) {
        delete property[propertyKey];
      }
      const type = typeof property[propertyKey];
      if (!shallow) {
        if (type === 'object') {
          property[propertyKey] = purgeCustomTags(
            property[propertyKey],
            expression
          );
        }
      }
    });
  return property;
}

async function writeFiles(
  fileRelativeId: string,
  miniSpec: any,
  staticDir: string,
  pathName: string,
  docsDir: string
) {
  const operations = Object.keys(miniSpec.paths[pathName]);
  for (const operation of operations) {
    if (verbs.includes(operation)) {
      const fileRelativePath = `${fileRelativeId}--${operation}`;
      const pathSpec = await cloneObject(miniSpec);

      pathSpec.paths[pathName] = purgeCustomTags(
        pathSpec.paths[pathName],
        (key) => verbs.includes(key) && key !== operation,
        true
      );

      await createSpecFile(fileRelativePath, pathSpec, staticDir);
      await createMarkdownFile(fileRelativePath, pathName, docsDir, operation);
    }
  }
}

type CreateOptions = {
  removeSecurityNode?: boolean;
  purgeExpression?: PurgeExpression;
  group?: 'by-tag';
  deletePath: (pathName: string) => boolean;
};

type TagNode = {
  [tagName: string]: string[];
};

type SpecNode = {
  [x: string]: SpecNode;
};

type SpecObjectTag = {
  name: string;
};

async function createNewTopics(
  specFileName: string,
  title: string,
  options: CreateOptions,
  specSourceDir: string,
  docsDir: string,
  staticDir: string
) {
  const specString = readFileSync(join(specSourceDir, specFileName), {
    encoding: 'utf-8',
  });
  const specObject = getSpecObject(specString);
  let specTemplate = await cloneObject(specObject);
  specTemplate.paths = {};

  if (options?.removeSecurityNode) {
    specTemplate = purgeCustomTags(
      specTemplate,
      (field) => field === 'security'
    );
  }

  if (options?.purgeExpression) {
    specTemplate = purgeCustomTags(specTemplate, options.purgeExpression);
  }

  const specObjectTags: SpecObjectTag[] = specObject.tags;
  if (options?.group === 'by-tag' && specObjectTags) {
    console.log('Grouping by tag...');
    specTemplate.tags = {};
    specObjectTags.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    for (const tag of specObjectTags) {
      const tagNode: TagNode = {
        [tag.name]: [],
      };

      for (const pathName of Object.keys(specObject.paths)) {
        if (
          Object.entries(specObject.paths[pathName]).some(
            (e: any) => e[1].tags && e[1].tags.includes(tag.name)
          )
        ) {
          const fileRelativeId = join(
            subfolderName,
            generateFolderName(title),
            tag.name,
            generateId(pathName)
          );

          let miniSpec = cloneDeep(specTemplate);
          miniSpec.paths[pathName] = specObject.paths[pathName];
          Object.entries(miniSpec.paths[pathName]).forEach((e) => {
            Object.keys(e).forEach((key) => {
              Object.keys(e[key as any]).forEach((subKey) => {
                // Delete if matcher purge expression
                if (
                  ['tags'].includes(subKey) ||
                  (options.purgeExpression && options.purgeExpression(subKey))
                ) {
                  delete (e[key as any] as Record<string, any>)[subKey];
                }

                // Set operation to uppercase, e.g., GET, POST, etc.
                if (['operationId'].includes(subKey)) {
                  const subKeyValue = (e[key as any] as Record<string, any>)[
                    subKey
                  ];
                  (e[key as any] as Record<string, any>)[subKey] = subKeyValue
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, function (str: string) {
                      return str.toUpperCase();
                    });
                }
              });
            });
          });
          await writeFiles(
            fileRelativeId,
            miniSpec,
            staticDir,
            pathName,
            docsDir
          );
          tagNode[tag.name].push(fileRelativeId);
        }
      }
    }
  } else {
    for (const pathName of Object.keys(specObject.paths)) {
      const excludePath =
        options && options.deletePath && options.deletePath(pathName);

      if (!excludePath) {
        const fileRelativePath = join(
          subfolderName,
          generateFolderName(title),
          generateId(pathName)
        );

        let miniSpec = await cloneObject(specTemplate);
        miniSpec.paths[pathName] = specObject.paths[pathName];
        await writeFiles(
          fileRelativePath,
          miniSpec,
          staticDir,
          pathName,
          docsDir
        );
      }
    }
  }
}

export type BuildPagesProps = {
  configPath: string;
};

export default async function buildPages({ configPath }: BuildPagesProps) {
  console.log('Building pages from specs...');
  const config = require(configPath);
  const { specSourceDir, docsDir, staticDir, specList } = config;
  for await (const item of specList) {
    if (item.task === 'generate-from-spec') {
      await createNewTopics(
        item.src,
        item.title,
        item.taskOptions,
        specSourceDir,
        docsDir,
        staticDir
      );
    }
  }

  const scriptFilename = 'gw.redoc.standalone.js';
  const scriptFileContents = readFileSync(
    resolve(__dirname, scriptFilename),
    'utf-8'
  );
  await writeFileIfNewOrChanged(
    resolve(staticDir, 'generated', scriptFilename),
    scriptFileContents
  );

  console.log(
    'Improved spec load times by removing',
    totalAbsolvedSins,
    'obsolete definitions across',
    totalNumberOfSavedSpecs,
    'spec pages'
  );
  console.log('DONE building pages from specs');
}
