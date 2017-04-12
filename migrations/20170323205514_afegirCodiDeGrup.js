
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('groups', function (table) {
      table.string('code', 32)
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('groups', function (table) {
      table.dropColumn('code')
    })
  ])
}
