
function fetchAllGroups () {
  return new models.Group().orderBy('id', 'ASC').fetchAll()
}

function fetchAllResources () {
  return new models.Resource().orderBy('id', 'ASC').fetchAll({
    withRelated: ['workpacks'],
  })
  .then((data) => {
    data.forEach((item) => { item.calculateAmountsinTasks() })
    return data
  })
}

function fetchAllWorkpacks () {
  return new models.Workpack()
  .orderBy('sort_wsb_id', 'ASC').orderBy('wsb_id', 'ASC').orderBy('order', 'ASC').orderBy('id', 'ASC')
  .fetchAll({
    withRelated: ['group', 'parent', 'predecessors', 'successors', 'resources'],
  })
}

function fetchByGroupId (id) {
  return new models.Group({ id }).orderBy('id', 'ASC').fetch()
}

function fetchByResourceId (id) {
  return new models.Resource({ id }).orderBy('id', 'ASC').fetch({
    withRelated: ['workpacks'],
  })
  .then((item) => {
    item.calculateAmountsinTasks()
    return item
  })
}

function fetchByWorkpackId (id) {
  return new models.Workpack({ id }).orderBy('order', 'ASC').orderBy('id', 'ASC')
  .fetch({
    withRelated: ['group', 'parent', 'predecessors', 'successors', 'resources', 'paramCosts']
  })
}

module.exports = {
  fetchAllGroups,
  fetchAllResources,
  fetchAllWorkpacks,
  fetchByGroupId,
  fetchByResourceId,
  fetchByWorkpackId,
}
