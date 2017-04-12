
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.raw('ALTER TABLE workpacks_workpacks ALTER COLUMN lag SET DATA TYPE varchar(32)')
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.raw('ALTER TABLE workpacks_workpacks ALTER COLUMN lag SET DATA TYPE float4')
  ])
}
