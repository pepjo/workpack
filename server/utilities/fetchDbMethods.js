
const { Group, Workpack } = require('../models')()

function fetchAllGroups () {
  return new Group().orderBy('id', 'ASC').fetchAll()
}

function fetchAllWorkpacks () {
  return new Workpack().orderBy('order', 'ASC').orderBy('id', 'ASC')
  .fetchAll({
    withRelated: ['group'],
  })
}

function fetchByGroupId (id) {
  return new Group({ id }).orderBy('id', 'ASC').fetch()
}

function fetchByWorkpackId (id) {
  return new Workpack({ id }).orderBy('order', 'ASC').orderBy('id', 'ASC').fetch({ withRelated: ['Group'] })
}

module.exports = {
  fetchAllGroups,
  fetchAllWorkpacks,
  fetchByGroupId,
  fetchByWorkpackId,
}
