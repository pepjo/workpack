
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('resources', function (table) {
      table.text('comment').index()
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('resources', function (table) {
      table.dropColumn('comment')
    })
  ])
}
