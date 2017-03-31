
const express = require('express')
const router = express.Router()

const  { fetchAllGroups, fetchAllWorkpacks, fetchByGroupId, fetchByWorkpackId } = require('../utilities/fetchDbMethods')
const  { deleteByGroupId, deleteByWorkpackId } = require('../utilities/deleteDbMethods')
const bookshelfToJSON = require('../utilities/bookshelfToJSON')

router.get('/work/:id', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    deleteByWorkpackId(req.params.id)
    .then(() => {
      console.log(`Work id: ${req.params.id} removed`)
      res.redirect(`/list/work?pass=${req.query.pass}`)
    })
    .catch((error) => {
      console.log('500 - ERROR', error)
      res.render('error')
    })
  } else {
    next()
  }
})

router.get('/group/:id', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    deleteByGroupId(req.params.id)
    .then((group) => {
      console.log(`Group id: ${req.params.id} removed`)
      res.redirect(`/list/groups?pass=${req.query.pass}`)
    })
    .catch((error) => {
      console.log('500 - ERROR', error)
      res.render('error')
    })
  } else {
    next()
  }
})

module.exports = router
