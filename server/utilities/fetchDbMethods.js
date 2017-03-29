
function fetchAllGroups () {
  return new models.Group().orderBy('id', 'ASC').fetchAll()
}

function fetchAllWorkpacks () {
  return new models.Workpack().orderBy('order', 'ASC').orderBy('id', 'ASC')
  .fetchAll({
    withRelated: ['group'],
  })
}

function fetchByGroupId (id) {
  return new models.Group({ id }).orderBy('id', 'ASC').fetch()
}

function fetchByWorkpackId (id) {
  return new models.Workpack({ id }).orderBy('order', 'ASC').orderBy('id', 'ASC')
  .fetch({
    withRelated: ['group']
  })
}

module.exports = {
  fetchAllGroups,
  fetchAllWorkpacks,
  fetchByGroupId,
  fetchByWorkpackId,
}
