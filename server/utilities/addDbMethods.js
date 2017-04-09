
function addGroup (data) {
  const group = Object.assign({}, data)
  group.id = isNaN(parseInt(group.id, 10)) ? undefined : parseInt(group.id, 10)

  return new models.Group(group).save()
}

function addResource (data) {
  const resource = Object.assign({}, data)
  resource.id = isNaN(parseInt(resource.id, 10)) ? undefined : parseInt(resource.id, 10)

  return new models.Resource(resource).save()
}

function addWork (data) {
  const predecessors = data.predecessors
  const resources = data.resources
  const resourcesData = []

  const work = Object.assign({}, data)
  delete work.oldparent
  delete work.oldgroup
  delete work.predecessors
  delete work.successors
  delete work.resources

  Object.keys(work).forEach((key) => {
    const regex = /^resources_amount_([0-9]+)$/
    if (regex.test(key)) {
      const id = parseInt(regex.exec(key)[1], 10)

      resourcesData.push({
        id,
        amount: parseFloat(work[key])
      })

      delete work[key]
    }
  })

  work.id = isNaN(parseInt(work.id, 10)) ? undefined : parseInt(work.id, 10)
  work.subid = isNaN(parseInt(work.subid, 10)) ? undefined : parseInt(work.subid, 10)
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

  return new models.Workpack(work).save()
  .then((work) => (
    Promise.all([
      work.predecessors().detach(),
      work.resources().detach(),
    ])
    .then(() => (work))
  ))
  .then((work) => (
    Promise.all([
      work.predecessors().attach(predecessors),
      work.resources().attach(resources),
    ])
    .then(() => (work))
  ))
  .then((work) => (
    Promise.all(resourcesData.map((res) => (
      work.resources().updatePivot(
        { amount: res.amount },
        { query: (qb) => { qb.where({ 'workpack_id': work.id, 'resource_id': res.id }) } }
      )
    )))
    .then(() => (work))
  ))
}

module.exports = {
  addGroup,
  addResource,
  addWork,
}
