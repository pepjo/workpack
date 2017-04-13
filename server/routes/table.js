
const express = require('express')
const router = express.Router()

const  {
  fetchAllGroups, fetchAllResources, fetchAllWorkpacks, fetchByGroupId, fetchByWorkpackId
} = require('../utilities/fetchDbMethods')
const bookshelfToJSON = require('../utilities/bookshelfToJSON')

router.get('/', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    res.render('tables', { pass })
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
    fetchAllWorkpacks()
    .then(bookshelfToJSON)
    .then((wks) => {
      const data = wks.reduce((all, work) => {
        const gindex = all.findIndex((group) => (group.group.id === work.groups_id))
        if (gindex === -1) {
          all.push({
            group: work.group,
            workpacks: [work]
          })
        } else {
          all[gindex].workpacks.push(work)
        }
        return all
      }, [])
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
    fetchAllWorkpacks()
    .then(bookshelfToJSON)
    .then((wks) => {
      const data = wks.reduce((all, work) => {
        const gindex = all.findIndex((group) => (group.group.id === work.groups_id))
        if (gindex === -1) {
          all.push({
            group: work.group,
            workpacks: [work]
          })
        } else {
          all[gindex].workpacks.push(work)
        }
        return all
      }, [])
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
    fetchAllResources()
    .then(bookshelfToJSON)
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
    fetchAllWorkpacks()
    .then(bookshelfToJSON)
    .then((wks) => {res.render('table_4_2', { pass, works: wks })})
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
    fetchAllWorkpacks()
    .then(bookshelfToJSON)
    .then((wks) => {res.render('table_5', { pass, works: wks })})
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
    fetchAllWorkpacks()
    .then(bookshelfToJSON)
    .then((wks) => {res.render('table_7', { pass, works: wks })})
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
    fetchAllWorkpacks()
    .then(bookshelfToJSON)
    .then((wks) => {res.render('table_8_2', { pass, works: wks })})
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
    fetchAllWorkpacks()
    .then(bookshelfToJSON)
    .then((wks) => {res.render('table_8_3', { pass, works: wks })})
    .catch((error) => {
      console.log('500 - ERROR', error)
      next()
    })
  } else {
    next()
  }
})

module.exports = router
