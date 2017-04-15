
const express = require('express')
const router = express.Router()

const {
  table_2_1,
  table_3_1,
  table_4_1,
  table_4_2,
  table_5,
  table_7,
  table_8_2,
  table_8_3,
} = require('../utilities/tablesData')

const generateTexZip = require('../utilities/generateTexZip')

router.get('/', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    res.render('tables', { pass })
  } else {
    next()
  }
})

router.get('/zip', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    generateTexZip().then((data) => {
      res.send(data)
    })
  } else {
    next()
  }
})

router.get('/jg', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    fetchAllWorkpacks()
    .then(bookshelfToJSON)
    .then((data) => {
      res.render('table_jg', { pass, data })
    })
    .catch((error) => {
      console.log('500 - ERROR', error)
      next()
    })
  } else {
    next()
  }
})

router.get('/2_1', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    table_2_1()
    .then((data) => {
      res.render('table_2_1', { pass, data })
    })
    .catch((error) => {
      console.log('500 - ERROR', error)
      next()
    })
  } else {
    next()
  }
})

router.get('/3_1', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    table_3_1()
    .then((data) => {
      res.render('table_3_1', { pass, data })
    })
    .catch((error) => {
      console.log('500 - ERROR', error)
      next()
    })
  } else {
    next()
  }
})

router.get('/4_1', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    table_4_1()
    .then((data) => {
      res.render('table_4_1', { pass, data })
    })
    .catch((error) => {
      console.log('500 - ERROR', error)
      next()
    })
  } else {
    next()
  }
})

router.get('/4_2', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    table_4_2()
    .then((data) => {
      res.render('table_4_2', { pass, data })}
    )
    .catch((error) => {
      console.log('500 - ERROR', error)
      next()
    })
  } else {
    next()
  }
})

router.get('/5', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    table_5()
    .then((data) => {
      res.render('table_5', { pass, data })
    })
    .catch((error) => {
      console.log('500 - ERROR', error)
      next()
    })
  } else {
    next()
  }
})

router.get('/7', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    table_7()
    .then((data) => {
      res.render('table_7', { pass, data })
    })
    .catch((error) => {
      console.log('500 - ERROR', error)
      next()
    })
  } else {
    next()
  }
})

router.get('/8_2', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    table_8_2()
    .then((data) => {
      res.render('table_8_2', { pass, data })
    })
    .catch((error) => {
      console.log('500 - ERROR', error)
      next()
    })
  } else {
    next()
  }
})

router.get('/8_3', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    table_8_3()
    .then((data) => {
      res.render('table_8_3', { pass, data })
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
