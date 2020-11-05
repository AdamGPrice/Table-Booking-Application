const knex = require('knex');

const knexConfig = require('../config/knex');
const environment = process.env.NODE_ENV || 'dev';  // Default to dev env
const connectionConfig = knexConfig[environment];

const connection = knex(connectionConfig);

module.exports = connection;