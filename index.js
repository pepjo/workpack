
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
    new Workpack().orderBy('order', 'ASC').orderBy('id', 'ASC').fetchAll().then(function(work) {
      res.render('work', { pass, work: work.toJSON() })
    }, (error) => {
      console.log('500 - ERROR', error)
      next()
    })
  } else {
    next()
  }
})
app.get('/list/groups', function (req, res, next) {
  if (req.query.pass === pass) {
    new Group().orderBy('id', 'ASC').fetchAll().then(function(group) {
      res.render('groups', { pass, group: group.toJSON() })
    }, (error) => {
      console.log('500 - ERROR', error)
      next()
    })
  } else {
    next()
  }
})
app.get('/add/work', function (req, res, next) {
  if (req.query.pass === pass) {
    new Group().fetchAll().then(function(group) {
      res.render('addWork', { pass, group: group.toJSON() })
    }, (error) => {
      console.log('500 - ERROR', error)
      next()
    })
  } else {
    next()
  }
})
app.get('/add/work/:id', function (req, res, next) {
  if (req.query.pass === pass) {
    new Group().fetchAll().then(function(group) {
      new Workpack({ id: req.params.id })
      .fetch()
      .then(function(work) {
        const wrk = Object.assign({}, work.toJSON())
        // Render this correctly
        const grp = group.toJSON().map((item) => (Object.assign({}, item,
          { selected: item.id === wrk.groups_id ? 'selected' : '' }
        )))
        wrk.ttypep = wrk.t_type === 't_p' ? 'selected="selected"' : ''
        wrk.ttypea = wrk.t_type === 't_a' ? 'selected="selected"' : ''
        wrk.ttype3 = wrk.t_type === 't_3' ? 'selected="selected"' : ''
        wrk.ctypep = wrk.c_type === 'c_p' ? 'selected="selected"' : ''
        wrk.ctypea = wrk.c_type === 'c_a' ? 'selected="selected"' : ''
        wrk.ctype3 = wrk.c_type === 'c_3' ? 'selected="selected"' : ''
        res.render('addWork', { pass, group: grp, work: wrk })
      })
    }, (error) => {
      console.log('500 - ERROR', error)
      next()
    })
  } else {
    next()
  }
})
app.post('/add/work', function (req, res, next) {
  if (req.query.pass === pass) {
    const work = Object.assign({}, req.body)
    work.id = isNaN(parseInt(work.id, 10)) ? undefined : parseInt(work.id, 10)
    work.order = isNaN(parseInt(work.order, 10)) ? undefined : parseInt(work.order, 10)
    work.groups_id = isNaN(parseInt(work.groups_id, 10)) ? undefined : parseInt(work.groups_id, 10)
    work.t_duration_estimate = isNaN(parseFloat(work.t_duration_estimate)) ? undefined : parseFloat(work.t_duration_estimate)
    work.t_p_effort_hours = isNaN(parseFloat(work.t_p_effort_hours)) ? undefined : parseFloat(work.t_p_effort_hours)
    work.t_p_resource_quantity = isNaN(parseFloat(work.t_p_resource_quantity)) ? undefined : parseFloat(work.t_p_resource_quantity)
    work.t_p_percentage_avaiable = isNaN(parseFloat(work.t_p_percentage_avaiable)) ? undefined : parseFloat(work.t_p_percentage_avaiable)
    work.t_p_performance_factor = isNaN(parseFloat(work.t_p_performance_factor)) ? undefined : parseFloat(work.t_p_performance_factor)
    work.t_a_previous_activity = isNaN(parseFloat(work.t_a_previous_activity)) ? undefined : parseFloat(work.t_a_previous_activity)
    work.t_a_previous_duration = isNaN(parseFloat(work.t_a_previous_duration)) ? undefined : parseFloat(work.t_a_previous_duration)
    work.t_a_current_activity = isNaN(parseFloat(work.t_a_current_activity)) ? undefined : parseFloat(work.t_a_current_activity)
    work.t_a_multiplier = isNaN(parseFloat(work.t_a_multiplier)) ? undefined : parseFloat(work.t_a_multiplier)
    work.t_3_optimistic_duration = isNaN(parseFloat(work.t_3_optimistic_duration)) ? undefined : parseFloat(work.t_3_optimistic_duration)
    work.t_3_mostlikely_duration = isNaN(parseFloat(work.t_3_mostlikely_duration)) ? undefined : parseFloat(work.t_3_mostlikely_duration)
    work.t_3_pessimistic_duration = isNaN(parseFloat(work.t_3_pessimistic_duration)) ? undefined : parseFloat(work.t_3_pessimistic_duration)
    work.c_cost_estimate = isNaN(parseFloat(work.c_cost_estimate)) ? undefined : parseFloat(work.c_cost_estimate)
    work.c_p_cost_per_unit = isNaN(parseFloat(work.c_p_cost_per_unit)) ? undefined : parseFloat(work.c_p_cost_per_unit)
    work.c_p_number_of_units = isNaN(parseFloat(work.c_p_number_of_units)) ? undefined : parseFloat(work.c_p_number_of_units)
    work.c_a_previous_activity = isNaN(parseFloat(work.c_a_previous_activity)) ? undefined : parseFloat(work.c_a_previous_activity)
    work.c_a_previous_cost = isNaN(parseFloat(work.c_a_previous_cost)) ? undefined : parseFloat(work.c_a_previous_cost)
    work.c_a_current_activity = isNaN(parseFloat(work.c_a_current_activity)) ? undefined : parseFloat(work.c_a_current_activity)
    work.c_a_multiplier = isNaN(parseFloat(work.c_a_multiplier)) ? undefined : parseFloat(work.c_a_multiplier)
    work.c_3_optimistic_cost = isNaN(parseFloat(work.c_3_optimistic_cost)) ? undefined : parseFloat(work.c_3_optimistic_cost)
    work.c_3_mostlikely_cost = isNaN(parseFloat(work.c_3_mostlikely_cost)) ? undefined : parseFloat(work.c_3_mostlikely_cost)
    work.c_3_pessimistic_cost = isNaN(parseFloat(work.c_3_pessimistic_cost)) ? undefined : parseFloat(work.c_3_pessimistic_cost)

    new Group().fetchAll()
    .then(function(group) {
      const grp = group.toJSON().map((item) => (Object.assign({}, item,
        { selected: item.id === work.groups_id ? 'selected="selected"' : '' }
      )))

      new Workpack(work).save().then(function(model) {
        res.render('addWork', { pass, group: grp })
      }, (error) => {
        // Render this correctly
        work.ttypep = work.t_type === 't_p' ? 'selected="selected"' : ''
        work.ttypea = work.t_type === 't_a' ? 'selected="selected"' : ''
        work.ttype3 = work.t_type === 't_3' ? 'selected="selected"' : ''
        work.ctypep = work.c_type === 'c_p' ? 'selected="selected"' : ''
        work.ctypea = work.c_type === 'c_a' ? 'selected="selected"' : ''
        work.ctype3 = work.c_type === 'c_3' ? 'selected="selected"' : ''
        
        console.log('work', work)
        res.render('addWork', { pass, group: grp, work: work, error: 'ERROR GUARDANT' })
        console.log('500 - ERROR', error)
      })
    }, (error) => {
      console.log('500 - ERROR', error)
      next()
    })
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
app.get('/add/group/:id', function (req, res, next) {
  if (req.query.pass === pass) {
    new Group({ id: req.params.id })
    .fetch()
    .then(function(group) {
      res.render('addGroup', { pass, group: group.toJSON() })
    })
  } else {
    next()
  }
})
app.post('/add/group', function (req, res, next) {
  if (req.query.pass === pass) {
    const group = Object.assign({}, req.body)
    group.id = isNaN(parseInt(group.id, 10)) ? undefined : parseInt(group.id, 10)

    new Group(group).save().then(function(model) {
      res.render('addGroup', { pass })
    }, (error) => {
      console.log('500 - ERROR', error)
      res.render('addGroup', { pass })
    })
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
