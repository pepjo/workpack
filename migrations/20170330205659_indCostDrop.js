
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('workpacks', function (table) {
      table.dropColumn('a_e_indirect_costs')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('workpacks', function (table) {
      table.float('a_e_indirect_costs')
    })
  ])
}
