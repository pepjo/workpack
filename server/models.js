

module.exports = function (bookshelf) {
  const Group = bookshelf.Model.extend({
    tableName: 'groups',
  })
  
  const Workpack = bookshelf.Model.extend({
    tableName: 'workpacks',
  })
  
  return { Group, Workpack }
}