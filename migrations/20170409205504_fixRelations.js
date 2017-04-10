
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('workpacks_workpacks', function (table) {
      table.string('relation', 8)
      table.float('lag')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('workpacks_workpacks', function (table) {
      table.dropColumn('relation')
      table.dropColumn('lag')
    })
  ])
}
