
exports.up = function (knex, Promise) {
  return knex.schema.table('groups', function (table) {
    table.integer('order')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('groups', function (table) {
    table.dropColumn('order')
  })
}
