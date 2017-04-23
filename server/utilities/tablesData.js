
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
          t_duration_estimate: Math.round(item.t_duration_estimate*100)/100,
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
      wks.map((item) => (
        Object.assign(item, {
          isTask: item.wsb_type === 'Task',
          isCp: item.c_type === 'c_p',
          isCa: item.c_type === 'c_a',
          isC3: item.c_type === 'c_3',
          cost_per_unit: decimals(item.cost_per_unit),
          estimate: decimals(item.estimate),
          c_a_current_activity: decimals(item.c_a_current_activity),
          c_cost_estimate: decimals(item.c_cost_estimate),
          c_3_optimistic_cost: decimals(item.c_3_optimistic_cost),
          c_3_mostlikely_cost: decimals(item.c_3_mostlikely_cost),
          c_3_pessimistic_cost: decimals(item.c_3_pessimistic_cost),
          c_cost_estimate: decimals(item.c_cost_estimate),
          paramCosts: item.paramCosts.map((item2) => (
            Object.assign(item2, {
              cost_per_unit: decimals(item2.cost_per_unit),
              estimate: decimals(item2.estimate),
            })
          ))
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
  table_8_3 () {
    return fetchAllWorkpacks()
    .then(bookshelfToJSON)
    .then((wks) => (
      wks
      .map((item) => ( Object.assign(item, { isTask: item.wsb_type === 'Task' }) ))
      .map((item) => {
        const dc = item.c_cost_estimate
        const ic = a_e_indirect_costs
        const re = item.a_e_reserve

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
        return Object.assign(item, {
          c_type: cType,
          c_cost_estimate: decimals(item.c_cost_estimate),
          a_e_reserve: decimals(dc * re * 0.01),
          a_e_indirect_costs: decimals(item.a_e_indirect_costs),
          a_e_estimate: decimals(ic + dc * (1 + re*0.01)),
        })
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
  },
  skeletonResources () {
    return fetchAllResources().then(bookshelfToJSON)
    .then((resources) => {
      return resources.reduce((all, resource) => {
        const index = all.findIndex((group) => (group.type === resource.type))
        if (index !== -1) {
          all[index].data.push(resource)
        } else {
          all.push({
            type: resource.type,
            data: [resource]
          })
        }
        return all
      }, [])
    })
    .then((data) => {
      return data.reduce((latex, group) => {
        return latex +
          `  \\item{\\textbf{${group.type}}}\n` +
          `  \\begin{itemize}\n` +
            group.data.map((item) => (
              `    \\item{\\textbf{${item.r_id}}${item.name}}\n`
            )).join('') +
          '  \\end{itemize}\n'
      }, '')
    })
  }
}

function parseChilds (obj) {
  if (obj.childs && obj.childs.length !== 0) {
    return '  \\begin{itemize}[noitemsep,label={}]\n' + (obj.childs.map((child) => {
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

function decimals (num) {
  const decimals = Math.round(num%1*100)
  if (decimals === 0) {
    return Math.floor(num) + '.00'
  } else {
    return Math.floor(num) + '.' + Math.round(num%1*100)
  }
}
