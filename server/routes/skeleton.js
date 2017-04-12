
const express = require('express')
const router = express.Router()

const  { fetchAllGroups, fetchAllWorkpacks } = require('../utilities/fetchDbMethods')
const bookshelfToJSON = require('../utilities/bookshelfToJSON')

function parseChilds (obj) {
  if (obj.childs) {
    return '<li style="list-style-type:none"><ul>' + (obj.childs.map((child) => {
      return `<li key=${child.id} style="cursor:pointer">
        <a href="/add/work/${child.id}?pass=smartlink">${child.wsb_id}</a>
      </li>${parseChilds(child)}`
    })
    .join('')) + '</ul></li>'
  } else {
    return ''
  }
}

function getChilds (workpacks, id) {
  return workpacks
  .filter((wrk) => ((wrk.parent || {}).id === id))
  .map((wrk) => {
    const wchilds = getChilds(workpacks, wrk.id)
    if (wchilds.length > 0) {
      return Object.assign({}, wrk, { childs: wchilds })
    } else {
      return wrk
    }
  })
}

router.get('/', function (req, res, next) {
  const pass = req.pass
  if (req.query.pass === pass) {
    Promise.all([
      fetchAllGroups().then(bookshelfToJSON),
      fetchAllWorkpacks().then(bookshelfToJSON),
    ])
    .then(([groups, workpacks]) => {
      // console.log('workpacks', workpacks)
      const data = groups.map((group) => {
        const childs = group.childs || []
        const newChilds = workpacks
        .filter((wrk) => (
          wrk.groups_id === group.id
            && ((wrk.parent || {}).id === null
            || typeof((wrk.parent || {}).id) === 'undefined')
        ))
        .map((wrk) => {
          const wchilds = getChilds(workpacks, wrk.id)
          if (wchilds.length > 0) {
            return Object.assign({}, wrk, { childs: wchilds })
          } else {
            return wrk
          }
        })

        // console.log('childs of ', group.id, newChilds)
        return Object.assign({}, group, { childs: [...childs, ...newChilds] })
      })

      const content = data.map((group) => {
        return `<li>${group.code}</li>${parseChilds(group)}`
      })
      .join('')

      res.render('skeleton', { pass, content })
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
