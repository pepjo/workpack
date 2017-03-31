
const express = require('express')
const router = express.Router()
const _ = require('lodash')

const  { fetchAllGroups, fetchAllWorkpacks, fetchByGroupId, fetchByWorkpackId } = require('../utilities/fetchDbMethods')
const  { addWork, addGroup, addResource } = require('../utilities/addDbMethods')
const bookshelfToJSON = require('../utilities/bookshelfToJSON')

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
      const wrk = Object.assign({}, work)
      // Render this correctly
      const grp = group.map((item) => (Object.assign({}, item,
        { selected: item.id === wrk.groups_id ? 'selected' : '' }
      )))

      wrk.ttypep = wrk.t_type === 't_p' ? 'selected="selected"' : ''
      wrk.ttypea = wrk.t_type === 't_a' ? 'selected="selected"' : ''
      wrk.ttype3 = wrk.t_type === 't_3' ? 'selected="selected"' : ''
      wrk.ctypep = wrk.c_type === 'c_p' ? 'selected="selected"' : ''
      wrk.ctypea = wrk.c_type === 'c_a' ? 'selected="selected"' : ''
      wrk.ctype3 = wrk.c_type === 'c_3' ? 'selected="selected"' : ''

      wrk.relationship_p_FS = wrk.relationship_p === 'FS' ? 'selected="selected"' : ''
      wrk.relationship_p_FF = wrk.relationship_p === 'FF' ? 'selected="selected"' : ''
      wrk.relationship_p_SS = wrk.relationship_p === 'SS' ? 'selected="selected"' : ''
      wrk.relationship_p_SF = wrk.relationship_p === 'SF' ? 'selected="selected"' : ''
      wrk.relationship_s_FS = wrk.relationship_s === 'FS' ? 'selected="selected"' : ''
      wrk.relationship_s_FF = wrk.relationship_s === 'FF' ? 'selected="selected"' : ''
      wrk.relationship_s_SS = wrk.relationship_s === 'SS' ? 'selected="selected"' : ''
      wrk.relationship_s_SF = wrk.relationship_s === 'SF' ? 'selected="selected"' : ''

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
  if (req.query.pass === pass) {
    const work = Object.assign({}, req.body)
    work.predecessors = work.predecessors && !_.isArray(work.predecessors) ?
      [work.predecessors] : work.predecessors
    work.successors = work.successors && !_.isArray(work.successors) ?
      [work.successors] : work.successors

    const render = (grp, works, error) => {
      // Render this correctly
      work.ttypep = work.t_type === 't_p' ? 'selected="selected"' : ''
      work.ttypea = work.t_type === 't_a' ? 'selected="selected"' : ''
      work.ttype3 = work.t_type === 't_3' ? 'selected="selected"' : ''
      work.ctypep = work.c_type === 'c_p' ? 'selected="selected"' : ''
      work.ctypea = work.c_type === 'c_a' ? 'selected="selected"' : ''
      work.ctype3 = work.c_type === 'c_3' ? 'selected="selected"' : ''

      work.relationship_p_FS = work.relationship_p === 'FS' ? 'selected="selected"' : ''
      work.relationship_p_FF = work.relationship_p === 'FF' ? 'selected="selected"' : ''
      work.relationship_p_SS = work.relationship_p === 'SS' ? 'selected="selected"' : ''
      work.relationship_p_SF = work.relationship_p === 'SF' ? 'selected="selected"' : ''
      work.relationship_s_FS = work.relationship_s === 'FS' ? 'selected="selected"' : ''
      work.relationship_s_FF = work.relationship_s === 'FF' ? 'selected="selected"' : ''
      work.relationship_s_SS = work.relationship_s === 'SS' ? 'selected="selected"' : ''
      work.relationship_s_SF = work.relationship_s === 'SF' ? 'selected="selected"' : ''

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

      addWork(work).then((model) => {
        render(grp, works, false)
      }, (error) => {
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
