
exports.up = function (knex, Promise) {
  return knex.schema.table('resources', function (table) {
    table.float('amount')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('resources', function (table) {
    table.dropColumn('amount')
  })
}
