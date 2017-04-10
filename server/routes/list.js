
const express = require('express')
const router = express.Router()

const  {
  fetchAllGroups, fetchAllResources, fetchAllWorkpacks, fetchByGroupId, fetchByWorkpackId
} = require('../utilities/fetchDbMethods')
const bookshelfToJSON = require('../utilities/bookshelfToJSON')

router.get('/work', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    fetchAllWorkpacks()
    .then(bookshelfToJSON)
    .then((wks) => {res.render('work', { pass, works: wks })})
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

router.get('/resources', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    fetchAllResources()
    .then(bookshelfToJSON)
    .then((resource) => {
      res.render('resources', { pass, resource: resource })
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
