
function deleteByGroupId (id) {
  return new models.Group({ id }).destroy()
}

function deleteByResourceId (id) {
  return new models.Resource({ id }).destroy()
}

function deleteByWorkpackId (id) {
  return new models.Workpack({ id }).destroy()
}

module.exports = {
  deleteByGroupId,
  deleteByResourceId,
  deleteByWorkpackId,
}
