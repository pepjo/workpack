
function deleteByGroupId (id) {
  return new models.Group({ id }).destroy()
}

function deleteByWorkpackId (id) {
  return new models.Workpack({ id }).destroy()
}

module.exports = {
  deleteByGroupId,
  deleteByWorkpackId,
}
