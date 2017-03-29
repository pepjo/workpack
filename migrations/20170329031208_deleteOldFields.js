
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('workpacks', function (table) {
      table.dropColumn('predecessors')
      table.dropColumn('successor')
      table.dropColumn('relationship_s')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('workpacks', function (table) {
      table.text('predecessors')
      table.text('successor')
      table.text('relationship_s')
    })
  ])
}
