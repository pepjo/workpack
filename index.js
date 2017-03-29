
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
bookshelf.plugin(require('bookshelf-cascade-delete'))

require('./server/models')(bookshelf)

const addRouter = require('./server/routes/add')
const delRouter = require('./server/routes/del')
const listRouter = require('./server/routes/list')

// Define the pass on all routers
app.use((req, res, next) => {
  req.pass = 'smartlink'
  next()
})

// Force https
app.get('*', (req, res, next) => {
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

app.use('/add', addRouter)
app.use('/del', delRouter)
app.use('/list', listRouter)

app.use(express.static('public'))

app.use((req, res, next) => {
  res.render('home', { layout: false })
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!')
})
