
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('resources', (table) => {
      table.increments('id').primary().index()
      table.text('r_id')
      table.text('name')
      table.text('type')
      table.text('comp')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.raw('DROP TABLE IF EXISTS resources CASCADE')
  ])
}
