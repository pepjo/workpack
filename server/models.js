
module.exports = function (bookshelf) {
  const Group = bookshelf.Model.extend({
    tableName: 'groups',
    workpacks () {
      return this.hasMany(Workpack, 'groups_id')
    }
  })

  const Resource = bookshelf.Model.extend({
    tableName: 'resources'
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
    },
    successors () {
      return this.belongsToMany(Workpack, 'workpacks_workpacks', 'predecessor_id', 'owner_id')
    }
  })

  global.models = { Group, Resource, Workpack }
}
