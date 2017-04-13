
function searchByGroupsWSBID (value) {
  return new models.Group()
  .query((qb) => {
    qb.where('code', 'ILIKE', `%${value}%`).limit(20)
  })
  .orderBy('id', 'ASC')
  .fetchAll()
}

function searchByResourcesWSBID (value) {
  return new models.Resource()
  .query((qb) => {
    qb.where('r_id', 'ILIKE', `%${value}%`).limit(20)
  })
  .orderBy('id', 'ASC')
  .fetchAll()
}

function searchByWorkpacksWSBID (value) {
  console.log('serach by workpack', `%${value}%`)
  return new models.Workpack()
  .query((qb) => {
    qb.where('wsb_id', 'ILIKE', `%${value}%`).limit(20)
  })
  .orderBy('sort_wsb_id', 'ASC').orderBy('wsb_id', 'ASC').orderBy('order', 'ASC').orderBy('id', 'ASC')
  .fetchAll()
}

function searchByGroupWSBID (value) {
  return new models.Group()
  .query((qb) => {
    qb.andWhere('code', '=', value)
  })
  .orderBy('id', 'ASC')
  .fetch()
}

function searchByResourceWSBID (value) {
  return new models.Resource()
  .query((qb) => {
    qb.andWhere('r_id', '=', value)
  })
  .orderBy('id', 'ASC')
  .fetch()
}

function searchByWorkpackWSBID (value) {
  return new models.Workpack()
  .query((qb) => {
    qb.andWhere('wsb_id', '=', value)
  })
  .orderBy('wsb_id', 'ASC').orderBy('order', 'ASC').orderBy('id', 'ASC')
  .fetch({
    withRelated: ['predecessors', 'successors', 'resources']
  })
}

module.exports = {
  searchByGroupsWSBID,
  searchByResourcesWSBID,
  searchByWorkpacksWSBID,
  searchByGroupWSBID,
  searchByResourceWSBID,
  searchByWorkpackWSBID,
}
