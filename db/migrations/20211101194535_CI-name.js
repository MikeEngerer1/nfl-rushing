exports.up = knex => knex.schema
  .raw('CREATE EXTENSION IF NOT EXISTS CITEXT') // Enables CITEXT on this database without throwing errors
  .alterTable('rushing', t => {
    t.specificType('Player', 'CITEXT').alter();
  });

exports.down = knex => knex.schema
  .alterTable('rushing', t => {
    t.string('Player').alter();
  });