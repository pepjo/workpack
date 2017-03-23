
const { Group, Workpack } = require('../models')()

function deleteByGroupId (id) {
  return new Group({ id }).destroy()
}

function deleteByWorkpackId (id) {
  return new Workpack({ id }).destroy()
}

module.exports = {
  deleteByGroupId,
  deleteByWorkpackId,
}
