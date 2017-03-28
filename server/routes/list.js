
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
      var newWorks = works.map((work) => {
        work.group_code = "";
        if (work.groups_id) {
          return fetchByGroupId(work.groups_id)
          .then(bookshelfToJSON)
          .then((group) => {
            work.group_code = group.code
            return work
          })
        }
        return work
      })
      return Promise.all(newWorks)
    })
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

module.exports = router
