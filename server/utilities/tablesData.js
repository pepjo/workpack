
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
    return fetchAllWorkpacks()
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
}
