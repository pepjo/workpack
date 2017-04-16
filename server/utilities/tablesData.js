
const  {
  fetchAllGroups, fetchAllResources, fetchAllWorkpacks, fetchByGroupId, fetchByWorkpackId
} = require('./fetchDbMethods')
const bookshelfToJSON = require('./bookshelfToJSON')

module.exports = {
  table_2_1 () {
    return fetchAllWorkpacks()
    .then(bookshelfToJSON)
    .then((wks) => (
      wks.reduce((all, work) => {
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
    ))
  },
  table_3_1 () {
    return fetchAllWorkpacks()
    .then(bookshelfToJSON)
    .then((wks) => (
      wks.reduce((all, work) => {
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
    ))
  },
  table_4_1 () {
    return fetchAllResources()
    .then(bookshelfToJSON)
  },
  table_4_2 () {
    return fetchAllWorkpacks()
    .then(bookshelfToJSON)
    .then((wks) => (
      wks
      .map((item) => Object.assign(item, { isTask: item.wsb_type === 'Task' }))
      .reduce((all, work) => {
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
    ))
  },
  table_5 () {
    return fetchAllWorkpacks()
    .then(bookshelfToJSON)
    .then((wks) => (
      wks.map((item) => (
        Object.assign(item, {
          isTask: item.wsb_type === 'Task',
          isTp: item.t_type === 't_p',
          isTa: item.t_type === 't_a',
          isT3: item.t_type === 't_3',
        })
      ))
      .reduce((all, work) => {
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
    ))
  },
  table_7 () {
    return fetchAllWorkpacks()
    .then(bookshelfToJSON)
    .then((wks) => (
      wks.filter((item) => (item.wsb_type === 'WP with tasks'))
    ))
  },
  table_8_2 () {
    return fetchAllWorkpacks()
    .then(bookshelfToJSON)
    .then((wks) => (
      wks.map((item) => ( Object.assign(item, { isTask: item.wsb_type === 'Task' }) ))
      .reduce((all, work) => {
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
    ))
  },
  table_8_3 () {
    return fetchAllWorkpacks()
    .then(bookshelfToJSON)
    .then((wks) => (
      wks
      .map((item) => ( Object.assign(item, { isTask: item.wsb_type === 'Task' }) ))
      .map((item) => {
        let cType
        switch (item.c_type) {
          case 'c_p':
            cType = 'Parametric'; break
          case 'c_a':
            cType = 'Analogous'; break
          case 'c_3':
            cType = 'Three-point method'; break
          default:
            cType = 'NONE'
        }
        return Object.assign(item, { c_type: cType })
      })
      .reduce((all, work) => {
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
    ))
  },
  skeleton () {
    return Promise.all([
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
        return `  \\item{\\textbf{${group.code}} ${group.name}}\n${parseChilds(group)}`
      })
      .join('')

      return content
    })
  }
}

function parseChilds (obj) {
  if (obj.childs && obj.childs.length !== 0) {
    return '  \\begin{itemize}\n' + (obj.childs.map((child) => {
      return `    \\item{\\textbf{${child.wsb_id}} ${child.activity}}\n${parseChilds(child)}`
    })
    .join('')) + '  \\end{itemize}\n'
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
