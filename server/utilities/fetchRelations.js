
function fetchWorkpackByIdPredecessors (id) {
  return new models.Workpack({ id }).orderBy('order', 'ASC').orderBy('id', 'ASC').predecessors().fetch()
}

function fetchWorkpackByIdSuccessor (id) {
  return new models.Workpack({ id }).orderBy('order', 'ASC').orderBy('id', 'ASC').successor().fetch()
}

module.exports = {
  fetchWorkpackByIdPredecessors,
  fetchWorkpackByIdSuccessor,
}
