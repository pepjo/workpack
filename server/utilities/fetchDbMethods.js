
function fetchAllGroups () {
  return new models.Group().orderBy('id', 'ASC').fetchAll()
}

function fetchAllResources () {
  return new models.Resource().orderBy('id', 'ASC').fetchAll()
}

function fetchAllWorkpacks () {
  return new models.Workpack().orderBy('order', 'ASC').orderBy('id', 'ASC')
  .fetchAll({
    withRelated: ['group', 'parent', 'predecessors', 'successors'],
  })
}

function fetchByGroupId (id) {
  return new models.Group({ id }).orderBy('id', 'ASC').fetch()
}

function fetchByResourceId (id) {
  return new models.Resource({ id }).orderBy('id', 'ASC').fetch()
}

function fetchByWorkpackId (id) {
  return new models.Workpack({ id }).orderBy('order', 'ASC').orderBy('id', 'ASC')
  .fetch({
    withRelated: ['group', 'parent', 'predecessors', 'successors', 'resources']
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
