
exports.up = function(knex) {
  return knex.schema.createTable('rushing', table => {
    table.increments();
    table.string('Player');
    table.string('Team');
    table.string('Pos');
    table.integer('Att');
    table.float('Att/G');
    table.integer('Yds');
    table.float('Avg');
    table.float('Yds/G');
    table.integer('TD');
    table.string('Lng');
    table.integer('1st');
    table.float('1st%');
    table.integer('20+');
    table.integer('40+');
    table.integer('FUM');
    table.timestamps(false, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('rushing')
};


