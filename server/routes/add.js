
const express = require('express')
const router = express.Router()

const  { fetchAllGroups, fetchAllWorkpacks, fetchByGroupId, fetchByWorkpackId } = require('../utilities/fetchDbMethods')
const  { addWork, addGroup } = require('../utilities/addDbMethods')
const { fetchWorkpackByIdPredecessors, fetchWorkpackByIdSuccessor } = require('../utilities/fetchRelations')
const bookshelfToJSON = require('../utilities/bookshelfToJSON')

router.get('/work', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    Promise.all([
      fetchAllGroups().then(bookshelfToJSON),
      fetchAllWorkpacks().then(bookshelfToJSON),
    ])
    .then(([group, works]) => {
      res.render('addWork', { pass, group, workpacks: works })
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
      fetchWorkpackByIdPredecessors(req.params.id).then(bookshelfToJSON),
      fetchWorkpackByIdSuccessor(req.params.id).then(bookshelfToJSON),
    ])
    .then(([group, work, works, predecessors, successor]) => {
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

      res.render('addWork', { pass, group: grp, work: wrk, workpacks: works,
        predecessors, successor })
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
      console.log('group', group)
      res.render('addGroup', { pass, group: group })
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

router.post('/work', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    const work = req.body

    Promise.all([
      fetchAllGroups().then(bookshelfToJSON),
      fetchAllWorkpacks().then(bookshelfToJSON),
    ])
    .then(([group, works]) => {
      const grp = group.map((item) => (Object.assign({}, item,
        { selected: item.id === parseInt(work.groups_id, 10) ? 'selected="selected"' : '' }
      )))

      addWork(work).then((model) => {
        res.render('addWork', { pass, group: grp, works })
      }, (error) => {
        // Render this correctly
        work.ttypep = work.t_type === 't_p' ? 'selected="selected"' : ''
        work.ttypea = work.t_type === 't_a' ? 'selected="selected"' : ''
        work.ttype3 = work.t_type === 't_3' ? 'selected="selected"' : ''
        work.ctypep = work.c_type === 'c_p' ? 'selected="selected"' : ''
        work.ctypea = work.c_type === 'c_a' ? 'selected="selected"' : ''
        work.ctype3 = work.c_type === 'c_3' ? 'selected="selected"' : ''

        console.log('work', work)
        res.render('addWork', { pass, group: grp, work: work, error: 'ERROR GUARDANT', workpacks: works })
        console.log('500 - ERROR', error)
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

module.exports = router
