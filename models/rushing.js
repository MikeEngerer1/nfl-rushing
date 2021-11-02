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

const list = (where) => {
  if (!where) where = {};
  // extract for later & delete 'Player' option
  const player = where.Player || null;
  delete where.Player;
  // fetch matching records; do not include internal fields; if 'Player' option supplied, return results for partial match
  return knex('rushing')
    .andWhere(where)
    .modify(query => player ? query.where('Player', 'LIKE', `%${player}%`) : null);
}

const update = (id, updates) => knex('rushing').where({id}).update(updates).returning('*');

const remove = (id) => knex('rushing').where({id}).del();

const format = (type, json) => {
  if (!type || !json) return Promise.reject('missing required params');
  if (type === 'html-table') {
    // get headers from first row in data; map to object containing {header: [header name (str)], sortable: [sortable in html table (boolean)]} 
    const headers = Object.keys(json[0]).map(header => ({header, sortable: header === 'Yds' || header === 'TD' || header === 'Lng' }));

    const rows = json.reduce((rows, obj) => {
        let row = [];
        for (let field in obj) {
          const value = obj[field];
          row.push(value);
        }
        rows.push(row);
        return rows;
      },[]);
    return {headers, rows}
  } else if (type === 'csv') {

  } else {
    return Promise.reject('given type param is invalid');
  }
}

module.exports = {
  schema, 
  create,
  find,
  list,
  update,
  remove,
  format
}