
const express = require('express')
const router = express.Router()
const _ = require('lodash')

const  { fetchAllGroups, fetchAllWorkpacks,
  fetchByGroupId, fetchByResourceId, fetchByWorkpackId } = require('../utilities/fetchDbMethods')
const  { addWork, addGroup, addResource } = require('../utilities/addDbMethods')
const generateSelectRenderProperties = require('../utilities/generateSelectRenderProperties')
const bookshelfToJSON = require('../utilities/bookshelfToJSON')
const recaluclateWBSids = require('../utilities/recalculateWBSids')

router.get('/work', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    Promise.all([
      fetchAllGroups().then(bookshelfToJSON),
      fetchAllWorkpacks().then(bookshelfToJSON),
    ])
    .then(([group, works]) => {
      res.render('addWork', { pass, group, workpacks: works, parents: works, predecessors: works, successors: works })
    })
    .catch((error) => {
      console.log('500 - ERROR', error)
      next()
    })
  } else {
    next()
  }
})

// Calculem la nova id per fer una previsualitzacó
router.get('/work/subid/:group/:parent/:order', function (req, res, next) {
  const pass = req.pass
  const group = parseInt(req.params.group, 10)
  const parent = parseInt(req.params.parent, 10)
  const order = parseInt(req.params.order, 10)
  let workpacks

  if (req.query.pass === pass) {
    if (isNaN(parent)) {
      workpacks = new models.Workpack()
      .query((qb) => {
        qb.whereNull('parent').andWhere('groups_id', '=', group)
      })
      .orderBy('order', 'ASC').orderBy('id', 'ASC')
      .fetchAll()
    } else {
      workpacks = new models.Workpack()
      .query('where', 'parent', '=', parent)
      .orderBy('order', 'ASC').orderBy('id', 'ASC')
      .fetchAll()
    }

    workpacks
    .then(bookshelfToJSON)
    .then((workpacks) => {
      let subid = 1
      for (let i = 0;  i < workpacks.length && workpacks[i].order < order; i++) {
        subid++
      }
      res.json({ subid })
    })
    .catch((error) => {
      console.log('500 - ERROR', error)
      next()
    })
  } else {
    next()
  }
})

router.get('/work/:id', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    Promise.all([
      fetchAllGroups().then(bookshelfToJSON),
      fetchByWorkpackId(req.params.id).then(bookshelfToJSON),
      fetchAllWorkpacks().then(bookshelfToJSON),
    ])
    .then(([group, work, works]) => {
      // console.log('data', works, predecessors, successor)
      let wrk = Object.assign({}, work)
      // Render this correctly
      const grp = group.map((item) => (Object.assign({}, item,
        { selected: item.id === wrk.groups_id ? 'selected' : '' }
      )))

      // Render this correctly
      wrk = generateSelectRenderProperties(wrk)

      res.render('addWork', {
        pass, group: grp, work: wrk, workpacks: works,
        predecessors: works.map((item) => {
          const isPred = (work.predecessors || []).find((pred) => (item.id === pred.id))
          if (isPred) {
            return Object.assign({ selected: ' selected="selected"' }, item)
          } else {
            return item
          }
        }),
        successors: works.map((item) => {
          const isSucc = (work.successors || []).find((succ) => (item.id === succ.id))
          if (isSucc) {
            return Object.assign({ selected: ' selected="selected"' }, item)
          } else {
            return item
          }
        }),
        parents: works.map((item) => {
          if (item.id === (work.parent || {}).id) {
            return Object.assign({ selected: 'selected="selected"' }, item)
          } else {
            return item
          }
        }),
      })
    })
    .catch((error) => {
      console.log('500 - ERROR', error)
      next()
    })
  } else {
    next()
  }
})

router.get('/group', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    res.render('addGroup', { pass })
  } else {
    next()
  }
})

router.get('/group/:id', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    fetchByGroupId(req.params.id)
    .then(bookshelfToJSON)
    .then((group) => {
      res.render('addGroup', { pass, group: group })
    })
  } else {
    next()
  }
})

router.get('/resource', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    res.render('addResource', { pass })
  } else {
    next()
  }
})

router.get('/resource/:id', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    fetchByResourceId(req.params.id)
    .then(bookshelfToJSON)
    .then((resource) => {
      res.render('addResource', { pass, resource: resource })
    })
  } else {
    next()
  }
})

/**
 *
 *        POST ROUTES
 *
 *
**/

router.post('/work(*)', function (req, res, next) {
  const pass = req.pass
  const oldparent = req.body.oldparent
  const oldgroup = req.body.oldgroup

  if (req.query.pass === pass) {
    let work = Object.assign({}, req.body)
    work.predecessors = work.predecessors && !_.isArray(work.predecessors) ?
      [work.predecessors] : work.predecessors
    work.successors = work.successors && !_.isArray(work.successors) ?
      [work.successors] : work.successors

    const render = (grp, works, error) => {
      // Render this correctly
      work = generateSelectRenderProperties(work)

      res.render('addWork', {
        pass, group: grp, work: work, error: error ? 'ERROR GUARDANT' : undefined, workpacks: works,
        predecessors: works.map((item) => {
          req.body.predecessors = req.body.predecessors && !_.isArray(req.body.predecessors) ?
            [req.body.predecessors] : req.body.predecessors
          const predecessors = req.body.predecessors && !_.isArray(req.body.predecessors) ?
            [req.body.predecessors] : req.body.predecessors
          const isPred = (predecessors || []).find((pred) => (item.id === parseInt(pred, 10)))
          if (isPred) {
            return Object.assign({ selected: ' selected="selected"' }, item)
          } else {
            return item
          }
        }),
        successors: works.map((item) => {
          req.body.successors = req.body.successors && !_.isArray(req.body.successors) ?
            [req.body.successors] : req.body.successors
          const successors = req.body.successors && !_.isArray(req.body.successors) ?
            [req.body.successors] : req.body.successors
          const isSucc = (successors || []).find((succ) => (item.id === parseInt(succ, 10)))
          if (isSucc) {
            return Object.assign({ selected: ' selected="selected"' }, item)
          } else {
            return item
          }
        }),
        parents: works.map((item) => {
          if (item.id === (work.parent || {}).id) {
            return Object.assign({ selected: 'selected="selected"' }, item)
          } else {
            return item
          }
        }),
      })
      if (error) console.log('500 - ERROR', error)
    }

    Promise.all([
      fetchAllGroups().then(bookshelfToJSON),
      fetchAllWorkpacks().then(bookshelfToJSON),
    ])
    .then(([group, works]) => {
      const grp = group.map((item) => (Object.assign({}, item,
        { selected: item.id === parseInt(work.groups_id, 10) ? 'selected="selected"' : '' }
      )))

      if (work.parent === 'null') {
        work.parent = null
      }

      addWork(work)
      .then(() => {
        return recaluclateWBSids({ parent: oldparent, group: oldgroup })
      })
      .then(() => {
        return recaluclateWBSids({ parent: work.parent, group: work.groups_id })
      })
      .then(() => {
        render(grp, works, false)
      })
      .catch((error) => {
        console.error(error)
        render(grp, works, true)
      })
    }, (error) => {
      console.log('500 - ERROR', error)
      next()
    })
  } else {
    next()
  }
})

router.post('/group', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    const group = req.body

    addGroup(group).then(() => {
      res.render('addGroup', { pass })
    })
    .catch((error) => {
      console.log('500 - ERROR', error)
      res.render('addGroup', { pass })
    })
  } else {
    next()
  }
})

router.post('/resource', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    const resource = req.body

    addResource(resource).then(() => {
      res.render('addResource', { pass })
    })
    .catch((error) => {
      console.log('500 - ERROR', error)
      res.render('addResource', { pass })
    })
  } else {
    next()
  }
})

module.exports = router
