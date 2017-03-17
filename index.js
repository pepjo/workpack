
require('dotenv').config()

const path = require('path')
const express = require('express')
const exphbs  = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()

const knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  // ssl: true,
})

const bookshelf = require('bookshelf')(knex)
bookshelf.plugin(require('bookshelf-schema')())

const { Group, Workpack } = require('./server/models')(bookshelf)

const pass = 'smartlink'

// Force https
app.get('*',function(req,res,next){
  if(process.env.NODE_ENV !== 'development' && req.headers['x-forwarded-proto']!='https')
    res.redirect('https://workpack.click/'+req.url)
  else
    next()
})

app.engine('handlebars', exphbs({
  viewsDir: path.join(__dirname, '/views/'),
  layoutsDir: path.join(__dirname, '/views/layouts'),
  defaultLayout: 'web',
  extension: 'handlebars',
  cache: process.env.NODE_ENV !== 'development',
}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/list/work', function (req, res, next) {
  if (req.query.pass === pass) {
    new Workpack().fetchAll().then(function(work) {
      res.render('work', { pass, work: work.toJSON() })
    }, () => (next()))
  } else {
    next()
  }
})
app.get('/list/groups', function (req, res, next) {
  if (req.query.pass === pass) {
    new Group().fetchAll().then(function(group) {
      res.render('groups', { pass, group: group.toJSON() })
    }, () => (next()))
  } else {
    next()
  }
})
app.get('/add/work', function (req, res, next) {
  if (req.query.pass === pass) {
    new Group().fetchAll().then(function(group) {
      console.log('group', group.toJSON())
      res.render('addWork', { pass, group: group.toJSON() })
    }, () => (next()))
  } else {
    next()
  }
})
app.post('/add/work', function (req, res, next) {
  if (req.query.pass === pass) {
    new Group().fetchAll()
    .then(function(group) {
      new Workpack(req.body).save().then(function(model) {
        console.log('group', group.toJSON())
        res.render('addWork', { pass, group: group.toJSON() })
      }, () => (next()))
    }, () => (next()))
  } else {
    next()
  }
})
app.get('/add/group', function (req, res, next) {
  if (req.query.pass === pass) {
    res.render('addGroup', { pass })
  } else {
    next()
  }
})
app.post('/add/group', function (req, res, next) {
  if (req.query.pass === pass) {
    new Group(req.body).save().then(function(model) {
      res.render('addGroup', { pass })
    }, () => (next()))
  } else {
    next()
  }
})

app.use(express.static('public'))

app.use(function(req, res, next){
  res.render('home', { layout: false })
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!')
})