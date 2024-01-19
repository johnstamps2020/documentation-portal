async function checkTaskStatus(taskId, elapsedTime = 0, reindexTaskResponse) {
  const statusCheckTimeout = 120000;
  console.log(`Checking status of reindexing task ${taskId}`);
  const taskStatus = await fetch(`${elasticsearchDevUrl}/_tasks/${taskId}`, {
    method: 'GET',
  }).then((res) => res.json());
  if (elapsedTime > 3600000) {
    throw new Error(
      'The reindexing task has been running for more than an hour. Terminating the build.'
    );
  }
  if (taskStatus.cancelled) {
    throw new Error('The reindexing task was cancelled');
  }
  if (taskStatus.completed) {
    console.log('Reindexing task completed');
    console.log(JSON.stringify(reindexTaskResponse, null, 2));
    return;
  }
  console.log('Reindexing task is still running. Checking again in 2 minutes');
  setTimeout(async () => {
    await checkTaskStatus(
      taskId,
      elapsedTime + statusCheckTimeout,
      reindexTaskResponse
    );
  }, statusCheckTimeout);
}

const elasticsearchDevUrl =
  'https://docsearch-doctools.dev.ccs.guidewire.net:443';
const indexName = 'gw-docs';
const deleteAllEntriesResponse = await fetch(
  `${elasticsearchDevUrl}/${indexName}/_delete_by_query?conflicts=proceed`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: {
        match_all: {},
      },
    }),
  }
).then((res) => res.json());
const deleteAllEntriesResponseError = deleteAllEntriesResponse.error;
if (deleteAllEntriesResponseError) {
  throw new Error(
    `Unable to delete all entries from the "${indexName}" index at ${elasticsearchDevUrl}. Error: ${deleteAllEntriesResponseError.reason}`
  );
}
console.log(
  `All entries deleted from the "${indexName}" index at ${elasticsearchDevUrl}`
);
const reindexTaskResponse = await fetch(
  `${elasticsearchDevUrl}/_reindex?wait_for_completion=false`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source: {
        remote: {
          host: 'https://docsearch-doctools.staging.ccs.guidewire.net:443',
          socket_timeout: '1m',
          connect_timeout: '1m',
        },
        index: indexName,
        size: 10,
      },
      dest: {
        index: indexName,
      },
      script: {
        source:
          "ctx._source.href = ctx._source.href.replace('https://docs.staging.ccs.guidewire.net/', 'https://docs.dev.ccs.guidewire.net/')",
        lang: 'painless',
      },
    }),
  }
).then((res) => res.json());
const reindexTaskError = reindexTaskResponse.error;
const reindexTaskId = reindexTaskResponse.task;
if (reindexTaskError) {
  throw new Error(
    `Reindexing task not started. Error: ${reindexTaskError.reason}`
  );
}
if (reindexTaskId === '') {
  throw new Error('Unable to get task ID');
}
console.log(`Reindexing task started. Task ID: ${reindexTaskId}`);
await checkTaskStatus(reindexTaskId, undefined, reindexTaskResponse);
