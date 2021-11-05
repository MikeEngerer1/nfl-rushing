// enables case-insensitive datatype on this table's 'Player' column
exports.up = knex => knex.schema
  .raw('CREATE EXTENSION IF NOT EXISTS CITEXT')
  .alterTable('rushing', t => {
    t.specificType('Player', 'CITEXT').alter();
  });

// convert datatype back to string
exports.down = knex => knex.schema
  .alterTable('rushing', t => {
    t.string('Player').alter();
  });