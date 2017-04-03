
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('workpacks', function (table) {
      table.integer('subid')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('workpacks', function (table) {
      table.dropColumn('subid')
    })
  ])
}
