
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('workpacks', function (table) {
      table.string('automatic_resources_mode', 32)
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('workpacks', function (table) {
      table.dropColumn('automatic_resources_mode')
    })
  ])
}

