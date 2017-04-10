
function addCP (field, value) {
  const id = ($('.c_p_item').toArray()
    .map((item) => (parseInt($(item).attr('newid'), 10)))
    .filter((item) => (item))
    .sort((first, second) => (second - first))
    [0] || 0) + 1

  const variable_cost = field === 'variable' ? value : ''
  const cost_per_unit = field === 'costUnit' ? value : 0
  const number_of_units = field === 'numUnits' ? value : 0

  const element = $(`<tr class="c_p_item" newid="${id}">`)
  .append(
    $('<td>')
    .append(
      $(`<label for="c_p_variable_cost_n${id}">Variable cost</label>`)
    )
    .append(
      $(`<input class="c_p_variable_cost" id="c_p_variable_cost_n${id}" name="c_p_variable_cost_n${id}"
        value="${variable_cost}" />`)
      .on('change', () => { calculateCP() })
    )
  )
  .append(
    $('<td>')
    .append(
      $(`<label for="c_p_cost_per_unit_n${id}">Cost per unit</label>`)
    )
    .append(
      $(`<input class="c_p_cost_per_unit" id="c_p_cost_per_unit_n${id}" name="c_p_cost_per_unit_n${id}"
        value="${cost_per_unit}" />`)
      .on('change', () => { calculateCP() })
    )
  )
  .append(
    $('<td>')
    .append(
      $(`<label for="c_p_number_of_units_n${id}">Number of units</label>`)
    )
    .append(
      $(`<input class="c_p_number_of_units" id="c_p_number_of_units_n${id}" name="c_p_number_of_units_n${id}"
        value="${number_of_units}" />`)
      .on('change', () => { calculateCP() })
    )
  )
  .append(
    $('<td>')
    .append(
      $(`<label for="c_p_estimate_n${id}">Estimate</label>`)
    )
    .append(
      $(`<input readonly class="c_cost_estimate" id="c_p_estimate_n${id}" name="c_p_estimate_n${id}" value="0" />`)
    )
  )
  .append(
    $('<td>')
    .append(
      $(`<a new ident="${id}" class="c_p_item__remove">Remove</a>`)
      .on('click', removeCP)
    )
  )

  $('#c_p').prepend(element)
  $('#c_p_variable_cost_new').val('')
  $('#c_p_cost_per_unit_new').val('')
  $('#c_p_number_of_units_new').val('')
}
function removeCP (event) {
  const id = $(event.target).attr('ident')
  const isNew = $(event.target).attr('new')
  if (isNew) {
    $(event.target).parents('.c_p_item').remove()
    calculateCP()
  } else {
    $.ajax({
      url:`/del/paramcost/${id}?pass=smartlink`, // TODO: dont hardcode it
      method: 'delete',
    })
    .done((data) => {
      $(event.target).parents('.c_p_item').remove()
      calculateCP()
    })
  }
}
function renderPredecesorsUI () {
  const current = $('#predecessors_relation_container li select')
  .toArray()
  .map((element) => {
    const rel = $(element)
    const id = parseInt(rel.attr('id').substr(22, 10000), 10)
    const lag = $('#predecessors_lag_container li input#predecessors_lag_' + id)

    return {
      id,
      titleR: rel.prev().text(),
      relation: rel.val(),
      titleL: lag.prev().text(),
      lag: lag.val(),
    }
  })

  const newopt = $('#predecessors option:selected')
  .toArray()
  .map((element) => {
    const jqe = $(element)
    const id = parseInt(jqe.val(), 10)
    const cur = current.find((item) => (item.id === id))

    if (cur) {
      return cur
    } else {
      return {
        id,
        titleR: `Relation ${jqe.text()}`,
        relation: '',
        titleL: `Lag ${jqe.text()}`,
        lag: '',
      }
    }
  })

  const newR = newopt
  .map((item) => (
    $('<li>')
    .append(
      $(`<label for="predecessors_relation_${item.id}">`)
      .text(
        item.titleR
      )
    )
    .append(
      $(`<select id="predecessors_relation_${item.id}" name="predecessors_relation_${item.id}">`)
      .append(
        $(`<option value="FS"${item.relation === 'FS' ? ' selected="selected"' : ''}>Finish-to-Start</option>`)
      )
      .append(
        $(`<option value="FF"${item.relation === 'FF' ? ' selected="selected"' : ''}>Finish-to-Finish</option>`)
      )
      .append(
        $(`<option value="SS"${item.relation === 'SS' ? ' selected="selected"' : ''}>Start-to-Start</option>`)
      )
      .append(
        $(`<option value="SF"${item.relation === 'SF' ? ' selected="selected"' : ''}>Star-to-Finish</option>`)
      )
    )
  ))

  const newL = newopt
  .map((item) => (
    $('<li>')
    .append(
      $(`<label for="predecessors_lag_${item.id}">`)
      .text(
        item.titleL
      )
    )
    .append(
      $(`<input id="predecessors_lag_${item.id}" name="predecessors_lag_${item.id}" value="${item.lag}" />`)
    )
  ))

  $('#predecessors_relation_container')
  .html('')
  .append(newR)

  $('#predecessors_lag_container')
  .html('')
  .append(newL)
}
function renderResourcesUI () {
  const current = $('#resources_amount_container li input')
  .toArray()
  .map((element) => {
    const jqe = $(element)

    return {
      id: parseInt(jqe.attr('id').substr(17, 10000), 10),
      title: jqe.prev().text(),
      value: jqe.val()
    }
  })

  const newV = $('#resources option:selected')
  .toArray()
  .map((element) => {
    const jqe = $(element)
    const id = parseInt(jqe.val(), 10)
    const cur = current.find((item) => (item.id === id))

    if (cur) {
      return cur
    } else {
      return { id, title: `Number ${jqe.text()}`, value: '' }
    }
  })
  .map((item) => (
    $('<li>')
    .append(
      $(`<label for="resources_amount_${item.id}">`)
      .text(
        item.title
      )
    )
    .append(
      $(`<input id="resources_amount_${item.id}" name="resources_amount_${item.id}" value="${item.value}" />`)
    )
  ))

  $('#resources_amount_container')
  .html('')
  .append(newV)
}
function recalculateEstimate () {
  const cl = $('#a_e_confidence_level').val()
  const ic = parseFloat($('#a_e_indirect_costs').val())
  const dc = parseFloat($('#c_cost_estimate').val())
  let re

  switch (cl) {
    case 'A':
      re = 5
      break
    case 'B':
      re = 10
      break
    case 'C':
      re = 15
      break
    default:
      re = 0
  }

  const es = (ic + dc) * (1 + re*0.01)
  console.log((ic + dc) * (1 + re*0.01), ic, dc, re)

  $('#a_e_reserve').val(re)
  $('#a_e_estimate').val(es)
}
function getNewWBSid () {
  let group = $('#groups_id').val()
  let parent = $('#parent').val()
  let order = $('#order').val()
  if (group === '') {
    group = '-'
  }
  if (parent === '' || parent === 'null') {
    parent = '-'
  }
  if (order === '') {
    order = '-'
  }

  $.ajax({
    url:`/add/work/subid/${group}/${parent}/${order}?pass=smartlink` // TODO: dont hardcode it
  })
  .done((data) => {
    $('#subid').val(data.subid)
    if (parent !== '-') {
      const parentTXT = $('#parent option:selected').text()
      $('#wsb_id').val(parentTXT + '.' + data.subid)
    } else {
      const groupTXT = $('#groups_id option:selected').attr('code')
      $('#wsb_id').val(groupTXT + '-' + data.subid)
    }
  })
}
function cleanTP (first) {
  $('#t_p_effort_hours').val('')
  $('#t_p_resource_quantity').val('')
  $('#t_p_percentage_avaiable').val('')
  $('#t_p_performance_factor').val('')
  if (!first) $('#t_duration_estimate').val('')
}
function cleanTA (first) {
  $('#t_a_previous_activity').val('')
  $('#t_a_previous_activity_txt').val('')
  $('#t_a_previous_duration').val('')
  $('#t_a_previous_duration_txt').val('')
  $('#t_a_current_activity').val('')
  $('#t_a_current_activity_txt').val('')
  $('#t_a_multiplier').val('')
  $('#t_a_multiplier_txt').val('')
  if (!first) $('#t_duration_estimate').val('')
}
function cleanT3 (first) {
  $('#t_3_optimistic_duration').val('')
  $('#t_3_mostlikely_duration').val('')
  $('#t_3_pessimistic_duration').val('')
  $('#t_3_wheighting_equation').val('')
  if (!first) $('#t_duration_estimate').val('')
}
function cleanCP (first) {
  $('#c_p_variable_cost').val('')
  $('#c_p_cost_per_unit').val('')
  $('#c_p_number_of_units').val('')
  if (!first) $('#c_cost_estimate').val('')
}
function cleanCA (first) {
  $('#c_a_previous_activity').val('')
  $('#c_a_previous_activity_txt').val('')
  $('#c_a_previous_cost').val('')
  $('#c_a_current_activity').val('')
  $('#c_a_current_activity_txt').val('')
  $('#c_a_multiplier').val('')
  if (!first) $('#c_cost_estimate').val('')
}
function cleanC3 (first) {
  $('#c_3_optimistic_cost').val('')
  $('#c_3_mostlikely_cost').val('')
  $('#c_3_pessimistic_cost').val('')
  $('#c_3_wheighting_equation').val('')
  if (!first) $('#c_cost_estimate').val('')
}
function calculateTP () {
  const effort = parseFloat($('#t_p_effort_hours').val())
  const quantity = parseFloat($('#t_p_resource_quantity').val())
  const percentage = parseFloat($('#t_p_percentage_avaiable').val())*0.01
  const perf = parseFloat($('#t_p_performance_factor').val())
  $('#t_duration_estimate').val(effort/quantity/percentage/perf)
}
function calculateTA () {
  const prevAct = parseFloat($('#t_a_previous_activity').val())
  // $('#t_a_previous_activity_txt').val()
  const prevDur = parseFloat($('#t_a_previous_duration').val())
  // $('#t_a_previous_duration_txt').val()
  const curAct = parseFloat($('#t_a_current_activity').val())
  // $('#t_a_current_activity_txt').val()
  const multi = curAct/prevAct
  // $('#t_a_multiplier_txt').val()
  $('#t_a_multiplier').val(multi)
  $('#t_duration_estimate').val(prevDur*multi)
}
function calculateT3 () {
  const o = parseFloat($('#t_3_optimistic_duration').val())
  const m = parseFloat($('#t_3_mostlikely_duration').val())
  const p = parseFloat($('#t_3_pessimistic_duration').val())
  const eq = $('#t_3_wheighting_equation').val()
  $('#t_duration_estimate').val(eval(eq))
}
function calculateCP () {
  const elements = $('.c_p_item').toArray()

  const individualValues = elements.map((element) => {
    const jqe = $(element)

    const variable = jqe.find('.c_p_variable_cost').val()
    const perUnit = parseFloat(jqe.find('.c_p_cost_per_unit').val())
    const numUnits = parseFloat(jqe.find('.c_p_number_of_units').val())
    const total = perUnit*numUnits || 0
    jqe.find('.c_cost_estimate').val(total)

    return total
  })

  $('#c_cost_estimate').val(individualValues.reduce((all, val) => (val + all), 0))
  recalculateEstimate()
}
function calculateCA () {
  const prevAct = parseFloat($('#c_a_previous_activity').val())
  // $('#c_a_previous_activity_txt').val()
  const prevCost = parseFloat($('#c_a_previous_cost').val())
  const curAct = parseFloat($('#c_a_current_activity').val())
  // $('#c_a_current_activity_txt').val()
  const multi = curAct/prevAct
  $('#c_a_multiplier').val(multi)
  $('#c_cost_estimate').val(prevCost*multi)
  recalculateEstimate()
}
function calculateC3 () {
  const o = parseFloat($('#c_3_optimistic_cost').val())
  const m = parseFloat($('#c_3_mostlikely_cost').val())
  const p = parseFloat($('#c_3_pessimistic_cost').val())
  const eq = $('#c_3_wheighting_equation').val()
  $('#c_cost_estimate').val(eval(eq))
  recalculateEstimate()
}
function setWPType (type) {
  if (type === 'Task') {
    $('label[for=order], #order').show()
    $('label[for=parent], #parent').show()
    $('label[for=groups_id], #groups_id').show()
    $('label[for=wsb_id], #wsb_id').show()
    $('label[for=activity], #activity').show()
    $('label[for=description_short], #description_short').show()
    $('label[for=description_of_work], #description_of_work').hide()
    $('label[for=predecessors], #predecessors').show()
    $('label[for=predecessors_relation_container], #predecessors_relation_container').show()
    $('label[for=predecessors_lag_container], #predecessors_lag_container').show()
    $('label[for=successor], #successor').show()
    $('label[for=successors_relation_container], #successors_relation_container').show()
    $('label[for=successors_lag_container], #successors_lag_container').show()
    $('label[for=resources], #resources').show()
    $('label[for=resources_amount_container], #resources_amount_container').show()
    $('label[for=skill_requirements], #skill_requirements').hide()
    $('label[for=other_required_ressources], #other_required_ressources').hide()
    $('label[for=type_of_effort], #type_of_effort').hide()
    $('label[for=location_performance], #location_performance').hide()
    $('label[for=constrains], #constrains').hide()
    $('label[for=assumptions], #assumptions').show()
    $('#time_container').show()
    $('#cost_container').show()
    $('#activity_container').show()
  } else if (type === 'WP with tasks') {
    $('label[for=order], #order').show()
    $('label[for=parent], #parent').show()
    $('label[for=groups_id], #groups_id').show()
    $('label[for=wsb_id], #wsb_id').show()
    $('label[for=activity], #activity').show()
    $('label[for=description_short], #description_short').show()
    $('label[for=description_of_work], #description_of_work').show()
    $('label[for=predecessors], #predecessors').hide()
    $('label[for=predecessors_relation_container], #predecessors_relation_container').hide()
    $('label[for=predecessors_lag_container], #predecessors_lag_container').hide()
    $('label[for=successor], #successor').hide()
    $('label[for=successors_relation_container], #successors_relation_container').hide()
    $('label[for=successors_lag_container], #successors_lag_container').hide()
    $('label[for=resources], #resources').hide()
    $('label[for=resources_amount_container], #resources_amount_container').hide()
    $('label[for=skill_requirements], #skill_requirements').show()
    $('label[for=other_required_ressources], #other_required_ressources').show()
    $('label[for=type_of_effort], #type_of_effort').show()
    $('label[for=location_performance], #location_performance').show()
    $('label[for=constrains], #constrains').show()
    $('label[for=assumptions], #assumptions').show()
    $('#time_container').hide()
    $('#cost_container').hide()
    $('#activity_container').hide()
  } else if (type === 'WP higher level') {
    $('label[for=order], #order').show()
    $('label[for=parent], #parent').show()
    $('label[for=groups_id], #groups_id').show()
    $('label[for=wsb_id], #wsb_id').show()
    $('label[for=activity], #activity').show()
    $('label[for=description_short], #description_short').show()
    $('label[for=description_of_work], #description_of_work').hide()
    $('label[for=predecessors], #predecessors').hide()
    $('label[for=predecessors_relation_container], #predecessors_relation_container').hide()
    $('label[for=predecessors_lag_container], #predecessors_lag_container').hide()
    $('label[for=successor], #successor').hide()
    $('label[for=successors_relation_container], #successors_relation_container').hide()
    $('label[for=successors_lag_container], #successors_lag_container').hide()
    $('label[for=resources], #resources').hide()
    $('label[for=resources_amount_container], #resources_amount_container').hide()
    $('label[for=skill_requirements], #skill_requirements').hide()
    $('label[for=other_required_ressources], #other_required_ressources').hide()
    $('label[for=type_of_effort], #type_of_effort').hide()
    $('label[for=location_performance], #location_performance').hide()
    $('label[for=constrains], #constrains').hide()
    $('label[for=assumptions], #assumptions').hide()
    $('#time_container').hide()
    $('#cost_container').hide()
    $('#activity_container').hide()
  }
}
function setTType (type, first) {
  if (type === 't_p') {
    $('#t_p').show()
    $('#t_a').hide()
    $('#t_3').hide()
    cleanTA(first)
    cleanT3(first)
  } else if (type === 't_a') {
    $('#t_p').hide()
    $('#t_a').show()
    $('#t_3').hide()
    cleanTP(first)
    cleanT3(first)
  } else if (type === 't_3') {
    $('#t_p').hide()
    $('#t_a').hide()
    $('#t_3').show()
    cleanTP(first)
    cleanTA(first)
  } else {
    $('#t_type').val()
    setTType('t_p')
  }
}
function setCType (type, first) {
  if (type === 'c_p') {
    $('#c_p').show()
    $('#c_a').hide()
    $('#c_3').hide()
    cleanCA(first)
    cleanC3(first)
  } else if (type === 'c_a') {
    $('#c_p').hide()
    $('#c_a').show()
    $('#c_3').hide()
    cleanCP(first)
    cleanC3(first)
  } else if (type === 'c_3') {
    $('#c_p').hide()
    $('#c_a').hide()
    $('#c_3').show()
    cleanCP(first)
    cleanCA(first)
  } else {
    $('#c_type').val('c_p')
    setCType('c_p')
  }
}

// Attach events
$('#wsb_type').on('change', (e) => { setWPType(e.target.value) })
$('#t_type').on('change', (e) => { setTType(e.target.value) })
$('#c_type').on('change', (e) => { setCType(e.target.value) })

// Select current values
setWPType($('#wsb_type').val())
setTType($('#t_type').val(), true)
setCType($('#c_type').val(), true)

// Attach recaluclate events
$('#t_p_effort_hours').on('change', () => { calculateTP() })
$('#t_p_resource_quantity').on('change', () => { calculateTP() })
$('#t_p_percentage_avaiable').on('change', () => { calculateTP() })
$('#t_p_performance_factor').on('change', () => { calculateTP() })
$('#t_a_previous_activity').on('change', () => { calculateTA() })
$('#t_a_previous_duration').on('change', () => { calculateTA() })
$('#t_a_current_activity').on('change', () => { calculateTA() })
$('#t_a_multiplier_txt').on('change', () => { calculateTA() })
$('#t_3_optimistic_duration').on('change', () => { calculateT3() })
$('#t_3_mostlikely_duration').on('change', () => { calculateT3() })
$('#t_3_pessimistic_duration').on('change', () => { calculateT3() })
$('#t_3_wheighting_equation').on('change', () => { calculateT3() })
$('#c_p_variable_cost').on('change', () => { calculateCP() })
$('#c_p_cost_per_unit').on('change', () => { calculateCP() })
$('#c_p_number_of_units').on('change', () => { calculateCP() })
$('#c_a_previous_activity').on('change', () => { calculateCA() })
$('#c_a_previous_cost').on('change', () => { calculateCA() })
$('#c_a_current_activity').on('change', () => { calculateCA() })
$('#c_3_optimistic_cost').on('change', () => { calculateC3() })
$('#c_3_mostlikely_cost').on('change', () => { calculateC3() })
$('#c_3_pessimistic_cost').on('change', () => { calculateC3() })
$('#c_3_wheighting_equation').on('change', () => { calculateC3() })

$('#order').on('change', () => { getNewWBSid() })
$('#parent').on('change', () => { getNewWBSid() })
$('#groups_id').on('change', () => { getNewWBSid() })

$('#a_e_confidence_level').on('change', () => { recalculateEstimate() })
$('#a_e_indirect_costs').on('change', () => { recalculateEstimate() })

$('#resources').on('change', () => { renderResourcesUI() })
$('#predecessors').on('change', () => { renderPredecesorsUI() })

$('#c_p_variable_cost_new').on('change', (e) => { addCP('variable', e.target.value) })
$('#c_p_cost_per_unit_new').on('change', (e) => { addCP('costUnit', e.target.value) })
$('#c_p_number_of_units_new').on('change', (e) => { addCP('numUnits', e.target.value) })

$('.c_p_item__remove').on('click', removeCP)
