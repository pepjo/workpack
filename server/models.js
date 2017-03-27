
module.exports = function () {
  const Group = bookshelf.Model.extend({
    tableName: 'groups',
    workpacks () {
      return this.hasMany(Workpack, 'group')
    }
  })

  const Workpack = bookshelf.Model.extend({
    tableName: 'workpacks',
    group () {
      return this.belongsTo(Group, 'group')
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
    successor () {
      return this.belongsToMany(Workpack, 'workpacks_workpacks', 'predecessor_id', 'owner_id')
    }
  })

  return { Group, Workpack }
}
