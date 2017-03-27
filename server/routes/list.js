
const express = require('express')
const router = express.Router()

const  { fetchAllGroups, fetchAllWorkpacks, fetchByGroupId, fetchByWorkpackId } = require('../utilities/fetchDbMethods')
const bookshelfToJSON = require('../utilities/bookshelfToJSON')

router.get('/work', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    fetchAllWorkpacks()
    .then(bookshelfToJSON)
    .then((works) => {
      works.map((work) => {
        work.group_code = "";
        if (work.groups_id) {
          fetchByGroupId(work.groups_id)
          .then(bookshelfToJSON)
          .then((group) => {work.group_code = group.code})
        }
      })
      return works
    })
    .then((wks) => {res.render('work', { pass, works: wks })})
    // .then((works) => works.map((work) => {return work}))
    // .then((work) => fetchByGroupId(work.groups_id))
    // .then(bookshelfToJSON)
    // .then((group) => {work.group_code = group.code})
    .catch((error) => {
      console.log('500 - ERROR', error)
      next()
    })
  } else {
    next()
  }
})

router.get('/groups', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    fetchAllGroups()
    .then(bookshelfToJSON)
    .then((group) => {
      res.render('groups', { pass, group: group })
    })
    .catch((error) => {
      console.log('500 - ERROR', error)
      next()
    })
  } else {
    next()
  }
})

module.exports = router
