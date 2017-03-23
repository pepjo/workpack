
const express = require('express')
const router = express.Router()

const  { fetchAllGroups, fetchAllWorkpacks, fetchByGroupId, fetchByWorkpackId } = require('../utilities/fetchDbMethods')
const bookshelfToJSON = require('../utilities/bookshelfToJSON')

router.get('/work', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    fetchAllWorkpacks()
    .then(bookshelfToJSON)
    .then((work) => {
      res.render('work', { pass, work: work })
    })
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
