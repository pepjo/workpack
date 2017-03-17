
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('groups', (table) => {
      table.increments('id').primary().index()
      table.text('name')
    }),
    knex.schema.createTable('workpacks', (table) => {
      table.increments('id').primary().index()
      table.integer('order')
      table.integer('groups_id').references('groups.id')
      table.text('wsb_id')
      table.text('activity')
      table.text('description_of_work')
      table.text('predecessors')
      table.text('relationship_p')
      table.text('lag_p')
      table.text('successor')
      table.text('relationship_s')
      table.text('lag_s')
      table.text('number_resources')
      table.text('skill_requirements')
      table.text('other_required_ressources')
      table.text('type_of_effort')
      table.text('location_performance')
      table.text('constrains')
      table.text('assumptions')
    }),
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.raw('DROP TABLE IF EXISTS groups CASCADE'),
    knex.schema.raw('DROP TABLE IF EXISTS workpacks CASCADE'),
  ])
};
