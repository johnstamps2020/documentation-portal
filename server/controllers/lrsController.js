require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');
const elasticClient = new Client({ node: process.env.ELASTIC_SEARCH_URL });
const indexName = 'lrs';
const { getSampleRecords } = require('./utils/lrsUtils');

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
    console.error(err);
    return formalizeError(err);
  }
}

async function addRecord(record) {
  try {
    const result = await elasticClient.index({
      index: indexName,
      id: `${record.actor.mbox}-${record.verb.id}-${record.object.id}`,
      refresh: true,
      body: record,
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
    const errorMessage = formalizeError(err);
    console.error(
      'ERROR CREATING RECORD',
      JSON.stringify(errorMessage, null, 2)
    );
    return formalizeError(errorMessage);
  }
}

async function deleteTestRecords() {
  try {
    console.log('DELETING TEST DATA');
    const result = await elasticClient.deleteByQuery({
      index: indexName,
      body: {
        query: {
          match: {
            'authority.name': 'Test',
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

module.exports = {
  createIndex,
  addRecord,
  getAllRecords,
  createTestRecords,
  deleteTestRecords,
};
