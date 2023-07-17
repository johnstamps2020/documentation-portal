'use strict';
require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');
const elasticClient = new Client({ node: process.env.ELASTIC_SEARCH_URL });
const indexName = 'lrs';
const { getSampleRecords } = require('./utils/lrsUtils');
const { winstonLogger } = require('./loggerController');

const anonymousName = 'Anonymous Person';
const anonymousMbox = 'mailto:anonymous@customer.or.partner.com';

function formalizeError(err) {
  return {
    statusCode: 500,
    error: err,
  };
}

async function createIndex() {
  try {
    console.log('ATTEMPTING TO CREATE INDEX', indexName);
    const result = await elasticClient.indices.create({
      index: indexName,
    });

    console.log('CREATED INDEX', JSON.stringify(result, null, 2));
    return result;
  } catch (err) {
    winstonLogger.error(
      `Cannot create an LRS index!
          ERROR: ${JSON.stringify(err)}`
    );
    return formalizeError(err);
  }
}

function anonymizeRecordIfExternalUser(record) {
  if (!record.actor.mbox.endsWith('@guidewire.com')) {
    const copyOfRecord = JSON.parse(JSON.stringify(record));
    copyOfRecord.actor.mbox = anonymousMbox;
    copyOfRecord.actor.name = anonymousName;

    return copyOfRecord;
  }

  return record;
}

async function addRecord(record) {
  try {
    const anonymousRecord = anonymizeRecordIfExternalUser(record);
    const result = await elasticClient.index({
      index: indexName,
      id: `${record.actor.mbox}-${record.verb.id}-${record.object.id}`,
      refresh: true,
      body: anonymousRecord,
    });

    return result;
  } catch (err) {
    return formalizeError(err);
  }
}

async function createTestRecords() {
  try {
    const sampleRecords = getSampleRecords();
    for (const record of sampleRecords) {
      const result = await addRecord(record);
      if (result.statusCode === 201) {
        console.log('Added sample record', record.actor.name);
      } else if (result.statusCode === 200) {
        console.log(`Record for ${record.actor.name} already exists`);
      } else {
        throw new Error(result);
      }
    }
  } catch (err) {
    winstonLogger.error(
      `Cannot create LRS test records
          ERROR: ${JSON.stringify(err)}`
    );
    return formalizeError(err);
  }
}

async function deleteTestRecords() {
  try {
    console.log('DELETING TEST DATA');
    const result = await elasticClient.deleteByQuery({
      index: indexName,
      body: {
        query: {
          bool: {
            must: {
              match: {
                'authority.name': 'Test',
              },
            },
          },
        },
      },
    });
    console.log('DELETION SUCCESSFUL', result);
  } catch (err) {
    return formalizeError(err);
  }
}

async function getAllRecords() {
  try {
    const result = await elasticClient.search({
      index: indexName,
      size: 1000,
      body: {
        query: {
          match_all: {},
        },
      },
    });

    return result;
  } catch (err) {
    return formalizeError(err);
  }
}

async function getRecordsByObjectId(objectId) {
  try {
    const result = await elasticClient.search({
      index: indexName,
      size: 1000,
      body: {
        query: {
          match: {
            'object.id.keyword': objectId,
          },
        },
      },
    });

    return result.body.hits?.hits?.map((h) => h._source) || [];
  } catch (err) {
    return formalizeError(err);
  }
}

async function getRecordsByActorMbox(actorMbox) {
  try {
    const result = await elasticClient.search({
      index: indexName,
      size: 1000,
      body: {
        query: {
          match: {
            'actor.mbox.keyword': actorMbox,
          },
        },
      },
    });

    return result.body.hits?.hits?.map((h) => h._source) || [];
  } catch (err) {
    return formalizeError(err);
  }
}

async function getRecordByObjectIdAndActorMbox(objectId, actorMbox) {
  try {
    const result = await elasticClient.search({
      index: indexName,
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  'object.id.keyword': { value: objectId, boost: 3.0 },
                },
              },
              {
                term: {
                  'actor.mbox.keyword': { value: actorMbox },
                },
              },
            ],
          },
        },
      },
    });

    const records = result.body.hits?.hits?.map((h) => h._source);
    const matchingRecord = records.find(
      (r) => r.object.id === objectId && r.actor.mbox === actorMbox
    );

    if (matchingRecord) {
      return matchingRecord;
    } else {
      return {};
    }
  } catch (err) {
    return formalizeError(err);
  }
}

async function deleteRecordByElasticId(elasticId) {
  try {
    const result = await elasticClient.delete({
      index: indexName,
      id: elasticId,
    });

    return result;
  } catch (err) {
    return formalizeError(err);
  }
}

async function anonymizeRecords() {
  try {
    const result = await getAllRecords();

    const allRecords = result.body.hits?.hits;
    const nonGuidewireRecordIds = allRecords
      .map((record) => {
        const mbox = record._source.actor.mbox;
        if (!mbox.endsWith('@guidewire.com')) {
          // return record._id;
          return record;
        }
      })
      .filter(Boolean);

    const results = [];
    Promise.all(
      nonGuidewireRecordIds.map(async (record) => {
        await elasticClient.update({
          index: indexName,
          id: record._id,
          body: {
            doc: {
              actor: {
                name: anonymousName,
                mbox: anonymousMbox,
              },
            },
          },
        });

        const updatedDoc = await elasticClient.get({
          index: indexName,
          id: record._id,
        });

        results.push(updatedDoc);
      })
    );

    return nonGuidewireRecordIds;
  } catch (err) {
    return formalizeError(err);
  }
}

module.exports = {
  createIndex,
  addRecord,
  getAllRecords,
  getRecordsByObjectId,
  getRecordsByActorMbox,
  getRecordByObjectIdAndActorMbox,
  createTestRecords,
  deleteTestRecords,
  deleteRecordByElasticId,
  anonymizeRecords,
};
