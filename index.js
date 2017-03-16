
require('dotenv').config()

const path = require('path')
const express = require('express')
const exphbs  = require('express-handlebars')
const app = express()

const pass = 'smartlink'

// Force https
app.get('*',function(req,res,next){
  if(req.headers['x-forwarded-proto']!='https')
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

app.get('/list/work', function (req, res, next) {
  if (req.query.pass === pass) {
    res.render('work')
  } else {
    next()
  }
})
app.get('/list/types?pass=smartlink', function (req, res, next) {
  if (req.query.pass === pass) {
    res.render('types')
  } else {
    next()
  }
})
app.get('/add/work?pass=smartlink', function (req, res, next) {
  if (req.query.pass === pass) {
    res.render('addWork')
  } else {
    next()
  }
})
app.get('/add/type?pass=smartlink', function (req, res, next) {
  if (req.query.pass === pass) {
    res.render('addList')
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