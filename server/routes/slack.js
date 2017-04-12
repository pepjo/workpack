
const express = require('express')
const router = express.Router()

const  {
  fetchAllGroups, fetchAllResources, fetchAllWorkpacks, fetchByGroupId, fetchByWorkpackId
} = require('../utilities/fetchDbMethods')
const bookshelfToJSON = require('../utilities/bookshelfToJSON')

router.post('/wlist', function (req, res, next) {
  console.log('body', req.body)
  console.log('body', req.body.token === process.env.SLACK_VERIFICATION_TOKEN)

  res.send({
    response_type: 'in_channel',
    text: 'Aquesta és la llista completa de workpacks:',
    attachments: [
      {
        text: 'Partly cloudy today and tomorrow'
      }
    ]
  })
})

module.exports = router
