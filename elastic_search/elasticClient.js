require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: process.env.ELASTIC_SEARCH_URL });

module.exports = client;