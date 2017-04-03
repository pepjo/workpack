
function deleteByGroupId (id) {
  return new models.Group({ id }).destroy()
}

function deleteByResourceId (id) {
  return new models.Resource({ id }).destroy()
}

function deleteByWorkpackId (id) {
  const workpack = new models.Workpack({ id }).fetch()

  return workpack.then((work) => {
    return work.predecessors().detach().then(() => (work))
  }).then((work) => {
    return work.successors().detach().then(() => (work))
  }).then((work) => {
    return work.destroy()
  })
}

module.exports = {
  deleteByGroupId,
  deleteByResourceId,
  deleteByWorkpackId,
}
