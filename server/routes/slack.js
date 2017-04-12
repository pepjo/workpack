
const express = require('express')
const router = express.Router()

const  {
  searchByGroupsWSBID,
  searchByResourcesWSBID,
  searchByWorkpacksWSBID,
  searchByGroupWSBID,
  searchByResourceWSBID,
  searchByWorkpackWSBID,
} = require('../utilities/searchDbMethods')
const bookshelfToJSON = require('../utilities/bookshelfToJSON')

router.post('/wlist', function (req, res, next) {
  if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
    searchByWorkpacksWSBID(req.body.text)
    .then(bookshelfToJSON)
    .then((data) => {
      res.send({
        response_type: 'in_channel',
        text: 'Aquests son els primers 20 workpacks que compleixen això:',
        attachments: [
          data.map((item) => ({
            title: 'WSB_ID',
            title_link: `https://workpack.click/add/work/${item.id}?pass=smartlink`,
            fields: [
              {
                title: 'Activity',
                value: item.activity,
                short: true
              }, {
                title: 'Type',
                value: item.wsb_type,
                short: true
              }, {
                title: 'Cost',
                value: item.c_cost_estimate,
                short: true
              }, {
                title: 'Time',
                value: item.t_duration_estimate,
                short: true
              }
            ]
          }))
        ]
      })
    })
    .catch((error) => {
      console.log('500 - ERROR', error)
      res.status(500).send('error')
    })
  } else {
    res.status(400).send('VERIFICATION ERROR')
  }
})

router.post('/work', function (req, res, next) {
  if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
    searchByWorkpackWSBID(req.body.text)
    .then(bookshelfToJSON)
    .then((data) => {
      res.send({
        response_type: 'in_channel',
        text: 'Aquesta és la llista completa de workpacks:',
        attachments: [
          {
            title: 'WSB_ID',
            title_link: `https://workpack.click/add/work/${data.id}?pass=smartlink`,
            fields: [
              {
                title: 'Activity',
                value: data.activity,
                short: false
              }, {
                title: 'Type',
                value: data.wsb_type,
                short: true
              }, {
                title: 'N. resources',
                value: data.predecessors.length,
                short: true
              }, {
                title: 'N. predecessors',
                value: data.successors.length,
                short: true
              }, {
                title: 'N. successors',
                value: data.resources.length,
                short: true
              }, {
                title: 'Cost',
                value: data.c_cost_estimate,
                short: true
              }, {
                title: 'Time',
                value: data.t_duration_estimate,
                short: true
              }
            ]
          }
        ]
      })
    })
    .catch((error) => {
      console.log('500 - ERROR', error)
      res.status(500).send('error')
    })
  } else {
    res.status(400).send('VERIFICATION ERROR')
  }
})

module.exports = router
