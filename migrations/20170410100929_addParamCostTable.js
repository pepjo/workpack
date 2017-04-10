
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('parametric_costs', (table) => {
      table.increments('id').primary().index()
      table.integer('workpack_id').references('workpacks.id')
      table.float('estimate')
      table.string('variable_cost', 512)
      table.float('cost_per_unit')
      table.float('number_of_units')
    }),
    knex.schema.table('workpacks', function (table) {
      table.dropColumn('c_p_variable_cost')
      table.dropColumn('c_p_cost_per_unit')
      table.dropColumn('c_p_number_of_units')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.raw('DROP TABLE IF EXISTS parametric_costs CASCADE'),
    knex.schema.table('workpacks', function (table) {
      table.string('c_p_variable_cost', 512)
      table.float('c_p_cost_per_unit')
      table.float('c_p_number_of_units')
    })
  ])
}
