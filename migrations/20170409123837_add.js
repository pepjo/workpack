
exports.up = function (knex, Promise) {
  return knex.schema
  .createTable('workpacks_resources', function (table) {
    table.integer('workpack_id').references('workpacks.id')
    table.integer('resource_id').references('resources.id')
    table.integer('amount')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTable('workpacks_resources')
}
