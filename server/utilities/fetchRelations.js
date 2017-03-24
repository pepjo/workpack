
const { Group, Workpack } = require('../models')()

function fetchWorkpackByIdPredecessors (id) {
  return new Workpack({ id }).orderBy('order', 'ASC').orderBy('id', 'ASC').predecessors().fetch()
}

function fetchWorkpackByIdSuccessors (id) {
  return new Workpack({ id }).orderBy('order', 'ASC').orderBy('id', 'ASC').successors().fetch()
}

module.exports = {
  fetchWorkpackByIdPredecessors,
  fetchWorkpackByIdSuccessors,
}
