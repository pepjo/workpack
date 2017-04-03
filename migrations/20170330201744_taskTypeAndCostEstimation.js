
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('workpacks', function (table) {
      table.string('wsb_type', 32)
      table.string('a_e_confidence_level', 1)
      table.float('a_e_indirect_costs')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('workpacks', function (table) {
      table.dropColumn('wsb_type')
      table.dropColumn('a_e_confidence_level')
      table.dropColumn('a_e_indirect_costs')
    })
  ])
}
