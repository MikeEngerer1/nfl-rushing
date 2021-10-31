const rushingData = require('../raw_data/rushing.json');
const Rushing = require('../../models/rushing');

const cleanInput = (type, value) => {
  if (type === 'int' && typeof value !== 'number') {
    return value ? parseInt(value.replace(/,/g, '')) : 0;
  } else if (type === 'float' && typeof value !== 'number') {
    return value ? parseFloat(value.replace(/,/g, '')) : 0;
  } else if (type === 'string' && typeof value !== 'string') {
    return value ? String(value) : '';
  }
  return value;
}

const cleanedRushingData = rushingData.reduce((final, row) => {
  const cleanedRow = {}
  for (field in row) {
    const type = Rushing.schema[field];
    cleanedRow[field] = cleanInput(type, row[field]);
  }
  final.push(cleanedRow);
  return final;
}, []);

exports.seed = function(knex) {
  return knex('rushing').del().then(() => knex('rushing').insert(cleanedRushingData));
};
