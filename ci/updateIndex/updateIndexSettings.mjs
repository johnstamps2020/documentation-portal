import {
  copyEntries,
  createEsClient,
  createIndex,
  deleteIndex,
  gwDocsBackupIndexName,
  gwDocsIndexName,
} from './helpers.mjs';

// Before running the script, provide the settings and mappings you want to use.
// The latest settings and mappings used by the doc crawler app are stored in
// "doctools-apps/apps/doc_crawler/doc_crawler/elastic_client.py".
export const gwDocsIndexSettingsAndMappings = {};

async function runAllTasks() {
  const timerLabel = 'All tasks done';
  try {
    console.time(timerLabel);
    const client = createEsClient('dev');
    console.log('Create the backup index with the new settings: started');
    await createIndex(
      client,
      gwDocsBackupIndexName,
      gwDocsIndexSettingsAndMappings
    );
    console.log('Create the backup index with the new settings: done');
    console.log(
      'Copy entries from the existing index to the backup index: started'
    );
    await copyEntries(client, gwDocsIndexName, gwDocsBackupIndexName);
    console.log(
      'Copy entries from the existing index to the backup index: done'
    );
    console.log('Delete the existing index: started');
    await deleteIndex(client, gwDocsIndexName);
    console.log('Delete the existing index: done');
    console.log('Create the target index with the new settings: started');
    await createIndex(client, gwDocsIndexName, gwDocsIndexSettingsAndMappings);
    console.log('Create the target index with the new settings: done');
    console.log(
      'Copy entries from the backup index to the target index: started'
    );
    await copyEntries(client, gwDocsBackupIndexName, gwDocsIndexName);
    console.log('Copy entries from the backup index to the target index: done');
    console.log('Delete the backup index: started');
    await deleteIndex(client, gwDocsBackupIndexName);
    console.log('Delete the backup index: done');
  } catch (error) {
    console.error(error);
  } finally {
    console.timeEnd(timerLabel);
  }
}

await runAllTasks();
