const { knex } = require('../db/db_instance');

const schema = {
    'Player': 'string',
    'Team': 'string',
    'Pos': 'string',
    'Att': 'int',
    'Att/G': 'float',
    'Yds': 'int',
    'Avg': 'float',
    'Yds/G': 'float',
    'TD': 'int',
    'Lng': 'string',
    '1st': 'int',
    '1st%': 'float',
    '20+': 'int',
    '40+': 'int',
    'FUM': 'int'
}

const create = (data) => knex('rushing').insert(data).returning('*');

const find = (where) => knex('rushing').where(where).first('*');

const list = async(where) => knex('rushing').where(where);

const update = (id, updates) => knex('rushing').where({id}).update(updates).returning('*');

const remove = (id) => knex('rushing').where({id}).del();

module.exports = {
  schema, 
  create,
  find,
  list,
  update,
  remove
}