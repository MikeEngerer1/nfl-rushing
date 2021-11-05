// import ENV variables
require('dotenv').config();

// import config file & current ENV
const knexfile = require('../knexfile'),
      { ENV } = process.env;

// initialize knex using ENV config
const knex = require('knex')(knexfile[ENV]);

// export knex instance
module.exports = { knex }

