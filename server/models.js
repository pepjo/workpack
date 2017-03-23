
module.exports = function () {
  const Group = global.bookshelf.Model.extend({
    tableName: 'groups',
  })

  const Workpack = global.bookshelf.Model.extend({
    tableName: 'workpacks',
  })

  return { Group, Workpack }
}
