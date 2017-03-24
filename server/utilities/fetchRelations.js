
const { Group, Workpack } = require('../models')()

function fetchWorkpackByIdPredecessors (id) {
  return new Workpack({ id }).orderBy('order', 'ASC').orderBy('id', 'ASC').predecessors()
}

function fetchWorkpackByIdSuccessors (id) {
  return new Workpack({ id }).orderBy('order', 'ASC').orderBy('id', 'ASC').successors()
}

module.exports = {
  fetchWorkpackByIdPredecessors,
  fetchWorkpackByIdSuccessors,
}
