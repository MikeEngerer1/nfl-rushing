// import required data & modules
const rushingData = require('../raw_data/rushing.json'),
      Misc = require('../../helpers/misc'),
      Rushing = require('../../models/rushing');

// datatypes of some values are inconsistent in the raw data
// loop through each field of each row and convert the given value to the expected type 
// expected types are described in Rushing.schema (models/rushing.js)
const cleanedRushingData = rushingData.reduce((cleanedData, row) => {
  const cleanedRow = {},
        { schema } = Rushing;
  // loop through each value in this row and convert it to its expected type if necessary
  for (field in row) {
    const { type } = schema[field];
    cleanedRow[field] = Misc.cleanInput(type, row[field]);
  }
  cleanedData.push(cleanedRow);
  // resulting object will contain all original fields with their cleaned values
  return cleanedData;
}, []);

// delete all from table, then insert cleaned data
exports.seed = function(knex) {
  return knex('rushing').del().then(() => knex('rushing').insert(cleanedRushingData));
};

// TODO: avoid all this extra work & error prone code -> refactor in typescript 