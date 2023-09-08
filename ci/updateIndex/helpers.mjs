import { Client } from '@elastic/elasticsearch';

export const gwDocsIndexName = 'gw-docs';
export const gwDocsBackupIndexName = 'gw-docs-backup';

export function createEsClient(envName) {
  const esInstances = {
    dev: 'https://docsearch-doctools.dev.ccs.guidewire.net',
    staging: 'https://docsearch-doctools.staging.ccs.guidewire.net',
    prod: 'https://docsearch-doctools.omega2-andromeda.guidewire.net',
  };
  return new Client({
    node: esInstances[envName],
  });
}

export async function countEntries(esClient, esIndexName, query) {
  const { body: result } = await esClient.count({
    index: esIndexName,
    body: query,
  });
  return result.count;
}

export async function checkTaskStatus(esClient, esTaskId) {
  const { body: task } = await esClient.tasks.get({ task_id: esTaskId });
  return task.completed;
}

export async function waitUntilTaskIsCompleted(
  esClient,
  esTaskId,
  timeout = 15000
) {
  let completed = false;
  while (!completed) {
    completed = await checkTaskStatus(esClient, esTaskId);
    if (!completed) {
      await new Promise((resolve) => setTimeout(resolve, timeout));
    }
  }
}

export async function createIndex(
  esClient,
  esIndexName,
  esIndexSettingsAndMappings
) {
  await esClient.indices.create({
    index: esIndexName,
    body: esIndexSettingsAndMappings,
  });
}

export async function copyEntries(esClient, srcEsIndexName, destEsIndexName) {
  const { body: result } = await esClient.reindex({
    body: {
      source: {
        index: srcEsIndexName,
      },
      dest: {
        index: destEsIndexName,
      },
    },
    wait_for_completion: false,
  });
  const taskId = result.task;
  console.log(`Task ID: ${taskId}`);
  await waitUntilTaskIsCompleted(esClient, taskId);
}

export async function deleteIndex(esClient, esIndexName) {
  await esClient.indices.delete({
    index: esIndexName,
  });
}
