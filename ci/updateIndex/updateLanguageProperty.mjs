import fs from 'fs';
import {
  countEntries,
  createEsClient,
  gwDocsIndexName,
  waitUntilTaskIsCompleted,
} from './helpers.mjs';

async function countEntriesWithLangProperty(esClient) {
  return await countEntries(esClient, gwDocsIndexName, {
    query: {
      bool: {
        must: {
          exists: {
            field: 'lang',
          },
        },
      },
    },
  });
}

async function countEntriesWithEmptyLangProperty(esClient) {
  return await countEntries(esClient, gwDocsIndexName, {
    query: {
      bool: {
        must_not: {
          exists: {
            field: 'lang',
          },
        },
      },
    },
  });
}

async function countEntriesWithLanguageProperty(esClient) {
  return await countEntries(esClient, gwDocsIndexName, {
    query: {
      bool: {
        must: {
          exists: {
            field: 'language',
          },
        },
      },
    },
  });
}

async function countEntriesWithEmptyLanguageProperty(esClient) {
  return await countEntries(esClient, gwDocsIndexName, {
    query: {
      bool: {
        must_not: {
          exists: {
            field: 'language',
          },
        },
      },
    },
  });
}

async function removeLangProperty(esClient) {
  const { body: result } = await esClient.updateByQuery({
    index: gwDocsIndexName,
    body: {
      script: {
        source: "ctx._source.remove('lang')",
      },
    },
    wait_for_completion: false,
  });
  const taskId = result.task;
  console.log(`Task ID: ${taskId}`);
  await waitUntilTaskIsCompleted(esClient, taskId);
}

async function addLanguageProperty(esClient) {
  const { body: result } = await esClient.updateByQuery({
    index: gwDocsIndexName,
    body: {
      script: {
        source: 'ctx._source.language = null',
      },
    },
    wait_for_completion: false,
  });
  const taskId = result.task;
  console.log(`Task ID: ${taskId}`);
  await waitUntilTaskIsCompleted(esClient, taskId);
}

async function updateLanguageProperty(esClient, rootDir) {
  const rootDirPaths = fs.readdirSync(rootDir);
  for (const rootDirPath of rootDirPaths) {
    const fullRootDirPath = `${rootDir}/${rootDirPath}`;
    if (fs.statSync(fullRootDirPath).isFile()) {
      const content = JSON.parse(fs.readFileSync(fullRootDirPath).toString());
      const { docs } = content;
      for (const doc of docs) {
        const { id } = doc;
        const { language } = doc.metadata;
        const { body: result } = await esClient.updateByQuery({
          index: gwDocsIndexName,
          body: {
            query: {
              match: {
                doc_id: id,
              },
            },
            script: {
              source: `ctx._source.language = '${language}'`,
            },
          },
          wait_for_completion: false,
        });
        const taskId = result.task;
        console.log(`Doc ID: ${id} | Task ID: ${taskId}`);
        await waitUntilTaskIsCompleted(esClient, taskId, 5000);
      }
    } else {
      await updateLanguageProperty(esClient, fullRootDirPath);
    }
  }
}

async function runAllCountTasks(esClient) {
  const entriesWithLangProperty = await countEntriesWithLangProperty(esClient);
  console.log(`Entries with lang: ${entriesWithLangProperty}`);
  const entriesWithEmptyLangProperty = await countEntriesWithEmptyLangProperty(
    esClient
  );
  console.log(
    `Entries with no lang or lang set to null: ${entriesWithEmptyLangProperty}`
  );
  const entriesWithLanguageProperty = await countEntriesWithLanguageProperty(
    esClient
  );
  console.log(`Entries with language: ${entriesWithLanguageProperty}`);
  const entriesWithEmptyLanguageProperty =
    await countEntriesWithEmptyLanguageProperty(esClient);
  console.log(
    `Entries with no language or language set to null: ${entriesWithEmptyLanguageProperty}`
  );
}

async function runAllLanguageTasks(esClient) {
  const docConfigsDir =
    '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/.teamcity/config/docs';
  console.log('Remove the lang property from all entries: started');
  await removeLangProperty(esClient);
  console.log('Remove the lang property from all entries: done');
  console.log('Add the language property to all entries: started');
  await addLanguageProperty(esClient);
  console.log('Add the language property to all entries: done');
  console.log('Update the value of the language property: started');
  await updateLanguageProperty(esClient, docConfigsDir);
  console.log('Update the value of the language property: done');
}

async function runAllTasks() {
  const timerLabel = 'All tasks done';
  try {
    console.time(timerLabel);
    const client = createEsClient('dev');
    await runAllCountTasks(client);
    await runAllLanguageTasks(client);
    await runAllCountTasks(client);
  } catch (error) {
    console.error(error);
  } finally {
    console.timeEnd(timerLabel);
  }
}

await runAllTasks();
