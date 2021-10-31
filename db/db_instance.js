require('dotenv').config();

const knexfile = require('../knexfile'),
      { ENV } = process.env,
      knex = require('knex')(knexfile[ENV]);

module.exports = { knex }

