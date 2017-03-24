
exports.up = function (knex, Promise) {
  return knex.schema.createTable('workpacks_workpacks', (table) => {
    table.integer('predecessor_id').references('workpacks.id')
    table.integer('owner_id').references('workpacks.id')
  })
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.raw('DROP TABLE IF EXISTS workpacks_workpacks'),
  ])
}
