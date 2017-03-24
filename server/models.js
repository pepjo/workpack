
module.exports = function () {
  const Group = global.bookshelf.Model.extend({
    tableName: 'groups',
  })
  
  const Workpack = bookshelf.Model.extend({
    tableName: 'workpacks',
  })

  return { Group, Workpack }
}
