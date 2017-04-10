
const express = require('express')
const router = express.Router()

const  {
  deleteByGroupId, deleteByResourceId, deleteByWorkpackId, deleteByParamCostId
} = require('../utilities/deleteDbMethods')

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
      res.render('error', { pass })
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
      res.render('error', { pass })
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

router.delete('/paramcost/:id', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    deleteByParamCostId(req.params.id)
    .then((group) => {
      console.log(`Param cost id: ${req.params.id} removed`)
      res.send('OK')
    })
  } else {
    next()
  }
})

module.exports = router
