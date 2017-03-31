
const express = require('express')
const router = express.Router()

const  { deleteByGroupId, deleteByResourceId, deleteByWorkpackId } = require('../utilities/deleteDbMethods')

router.get('/work/:id', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    deleteByWorkpackId(req.params.id)
    .then(() => {
      console.log(`Work id: ${req.params.id} removed`)
      res.redirect(`/list/work?pass=${req.query.pass}`)
    }), (error) => {
      console.log('500 - ERROR', error)
      next()
    }
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
  } else {
    next()
  }
})

router.get('/resource/:id', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    deleteByResourceId(req.params.id)
    .then((group) => {
      console.log(`Resource id: ${req.params.id} removed`)
      res.redirect(`/list/resources?pass=${req.query.pass}`)
    })
  } else {
    next()
  }
})

module.exports = router
