
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

const Fields = require('bookshelf-schema/lib/fields')
const Relations = require('bookshelf-schema/lib/relations')

const Group = bookshelf.Model.extend({
  tableName: 'groups',
}, {
  schema: [
    Fields.IntField('id'),
    Fields.StringField('name'),
  ]
})

const Workpack = bookshelf.Model.extend({
  tableName: 'workpacks',
}, {
  schema: [
    Fields.IntField('id'),
    Fields.IntField('order'),
    Relations.BelongsTo(Group),
    Fields.StringField('wsb_id'),
    Fields.StringField('activity'),
    Fields.StringField('description_of_work'),
    Fields.StringField('predecessors'),
    Fields.StringField('relationship_p'),
    Fields.StringField('lag_p'),
    Fields.StringField('successor'),
    Fields.StringField('relationship_s'),
    Fields.StringField('lag_s'),
    Fields.StringField('number_resources'),
    Fields.StringField('skill_requirements'),
    Fields.StringField('other_required_ressources'),
    Fields.StringField('type_of_effort'),
    Fields.StringField('location_performance'),
    Fields.StringField('constrains'),
    Fields.StringField('assumptions'),
  ]
})

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
    res.render('work', { pass })
  } else {
    next()
  }
})
app.get('/list/groups', function (req, res, next) {
  if (req.query.pass === pass) {
    new Group().fetchAll().then(function(group) {
      res.render('groups', { pass, group: group.toJSON() })
    }, () => (next()));
  } else {
    next()
  }
})
app.get('/add/work', function (req, res, next) {
  if (req.query.pass === pass) {
    res.render('addWork', { pass })
  } else {
    next()
  }
})
app.post('/add/work', function (req, res, next) {
  if (req.query.pass === pass) {
    res.render('addWork', { pass })
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