
module.exports = function (bookshelf) {
  const Group = bookshelf.Model.extend({
    tableName: 'groups',
    workpacks () {
      return this.hasMany(Workpack, 'groups_id')
    }
  })

  const Resource = bookshelf.Model.extend({
    tableName: 'resources',
    workpacks () {
      return this.belongsToMany(Workpack, 'workpacks_resources', 'resource_id', 'workpack_id').withPivot(['amount'])
    },
  })

  const Workpack = bookshelf.Model.extend({
    tableName: 'workpacks',
    group () {
      return this.belongsTo(Group, 'groups_id')
    },
    parent () {
      return this.belongsTo(Workpack, 'parent')
    },
    childs () {
      return this.hasMany(Workpack, 'parent')
    },
    predecessors () {
      return this.belongsToMany(Workpack, 'workpacks_workpacks', 'owner_id', 'predecessor_id')
      .withPivot(['relation', 'lag'])
    },
    successors () {
      return this.belongsToMany(Workpack, 'workpacks_workpacks', 'predecessor_id', 'owner_id')
      .withPivot(['relation', 'lag'])
    },
    resources () {
      return this.belongsToMany(Resource, 'workpacks_resources', 'workpack_id', 'resource_id').withPivot(['amount'])
    },
  })

  const Workpacks = bookshelf.Collection.extend({
    model: Workpack
  })

  global.models = { Group, Resource, Workpack, Workpacks }
}
