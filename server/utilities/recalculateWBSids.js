
const bookshelfToJSON = require('./bookshelfToJSON')

module.exports = function reccalc (opts) {
  let workpacks
  if (opts.parent) {
    workpacks = new models.Workpack()
    .query('where', 'parent', '=', opts.parent)
    .orderBy('order', 'ASC').orderBy('id', 'ASC')
    .fetchAll({
      withRelated: ['group', 'parent'],
    })
  } else if (opts.group) {
    workpacks = new models.Workpack()
    .query((qb) => {
      qb.whereNull('parent').andWhere('groups_id', '=', opts.group)
    })
    .orderBy('order', 'ASC').orderBy('id', 'ASC')
    .fetchAll({
      withRelated: ['group', 'parent'],
    })
  }

  let recalculate = []

  return workpacks
  .then(bookshelfToJSON)
  .then((workpks) => {
    return workpks.map((item, i) => {
      item.subid = i + 1

      if (opts.parent) {
        if (item.wsb_id !== item.parent.wsb_id + '.' + item.subid) {
          recalculate.push(item)
        }
        item.wsb_id = item.parent.wsb_id + '.' + item.subid
        item.parent = item.parent.ids
      } else if (opts.group) {
        if (item.wsb_id !== item.group.code + '-' + item.subid) {
          recalculate.push(item)
        }
        item.wsb_id = item.group.code + '-' + item.subid
        item.parent = null
      }

      delete item.group

      return item
    })
  })
  .then((data) => {
    return models.Workpacks.forge(data).invokeThen('save')
  })
  .then(() => {
    if (recalculate.length !== 0) {
      return Promise.all(recalculate.map((item) => (
        reccalc({ parent: item.id })
      )))
    } else {
      return true
    }
  })
}
