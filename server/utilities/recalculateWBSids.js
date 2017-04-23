
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
  } else {
    console.error('ERROR1: neither group nor parent', opts.parent, opts.group)
  }

  let recalculate = []

  return workpacks
  .then(bookshelfToJSON)
  .then((workpks) => {
    return workpks.map((item, i) => {
      item.subid = i + 1
      const subid = item.subid
      const paddedsubid = subid.pad(4)

      if (opts.parent) {
        if (item.sort_wsb_id !== item.parent.sort_wsb_id + '.' + paddedsubid) {
          recalculate.push(item)
        }
        item.wsb_id = item.parent.wsb_id + '.' + subid
        item.sort_wsb_id = item.parent.sort_wsb_id + '.' + paddedsubid
        item.parent = item.parent.ids
      } else if (opts.group) {
        if (item.sort_wsb_id !== item.group.id + item.group.code + '-' + paddedsubid) {
          recalculate.push(item)
        }
        item.wsb_id = item.group.code + '-' + subid
        item.sort_wsb_id = item.group.id + item.group.code + '-' + paddedsubid
        item.parent = null
      } else {
        console.error('ERROR2: neither group nor parent', opts.parent, opts.group)
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
