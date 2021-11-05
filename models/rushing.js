// import knex instance
const { knex } = require('../db/db_instance');

// describes each field in the 'rushing' table
const schema = {
    'Player': { type: 'string', sortable: false },
    'Team': { type: 'string', sortable: false },
    'Pos': { type: 'string', sortable: false },
    'Att': { type: 'int', sortable: false },
    'Att/G': { type: 'float', sortable: false },
    'Yds': { type: 'int', sortable: true },
    'Avg': { type: 'float', sortable: false },
    'Yds/G': { type: 'float', sortable: false },
    'TD': { type: 'int', sortable: true },
    'Lng': { type: 'string', sortable: true },
    '1st': { type: 'int', sortable: false },
    '1st%': { type: 'float', sortable: false },
    '20+': { type: 'int', sortable: false },
    '40+': { type: 'int', sortable: false },
    'FUM': { type: 'int', sortable: false }
}

// insert new row
const create = (data) => knex('rushing').insert(data).returning('*');

// fetch single row matching given conditions
const find = (where) => knex('rushing').where(where).first('*');

// update a single row by id
const update = (id, updates) => knex('rushing').where({id}).update(updates).returning('*');

// delete a single row by id
const remove = (id) => knex('rushing').where({id}).del();

// fetch all rows that satisfy a set of given 'where' conditions
// limited to <=100 rows per call; if offset is given, return the next <=100 rows after the offset
const list = (where, limit, offset) => {
  // knex will throw an error if 'where' is undefined
  if (!where) where = {};
  // 'Player' deletion below will mutate the original.. don't want that!
  const copy = {...where}
  // 'Player' option needs special evaluation (partial match allowed)
  // extract for later & delete from options
  const player = copy.Player || null;
  delete copy.Player;

  return knex('rushing')
    .where(copy)
    .modify(query => player ? query.where('Player', 'LIKE', `%${player}%`) : null)
    .modify(query => query.limit(limit ? limit : 100))
    .modify(query => offset ? query.offset(offset) : null);
}

// get the count of rows matching a set of given 'where' conditions 
const listCount = (where) => {
  // knex will throw an error if 'where' is undefined
  if (!where) where = {};
  // 'Player' deletion below will mutate the original.. don't want that!
  const copy = {...where}
  // 'Player' option needs special evaluation (partial match allowed)
  // extract for later & delete from options
  const player = copy.Player || null;
  delete copy.Player;

  return knex('rushing')
    .where(copy)
    .first(knex.raw('count(distinct(id)) as count'))
    .modify(query => player ? query.where('Player', 'LIKE', `%${player}%`) : null)
    .then(result => result.count)
}

// given an output type and rushing data set, return the converted data in its expected formatting 
// type = 'html-table' -> return {headers: [{header, sortable},...], rows: [[row],...]}
// type = 'csv' -> return {fields: [field,...], rows: [rows,...]}
const format = (type, data) => {
  // cannot procede without either parameter
  if (!type || !data) return Promise.reject('missing required params');
  // remove irrelevant/protected fields
  const cleanedData = data.map(e => {
    delete e.id;
    delete e.created_at;
    delete e.updated_at;
    return e;
  })
  if (type === 'html-table') {
    // get headers from first row in data
    const headers = Object.keys(cleanedData[0]).map(header => ({header, sortable: schema[header] ? schema[header].sortable : false }));

    // given data is an array of objects
    // reduce to 2d array for easy template logic
    const rows = cleanedData.reduce((rows, obj) => {
        const row = [];
        for (let field in obj) {
          const value = obj[field];
          row.push(value);
        }
        rows.push(row);
        return rows;
      }, []);

    return {headers, rows}
  } else if (type === 'csv') {
    // get fields from first row in data
    const fields = Object.keys(data[0]);
    return {fields, rows: data}
  } else {
    return Promise.reject('given type param is invalid');
  }
}

// export public functions/data
module.exports = {
  schema, 
  create,
  find,
  list,
  listCount,
  update,
  remove,
  format
}