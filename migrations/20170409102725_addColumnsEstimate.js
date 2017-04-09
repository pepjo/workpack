
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('workpacks', function (table) {
      table.float('a_e_reserve')
      table.float('a_e_estimate')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('workpacks', function (table) {
      table.dropColumn('a_e_reserve')
      table.dropColumn('a_e_estimate')
    })
  ])
}
