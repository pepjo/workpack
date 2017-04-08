
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
  const variable = $('#c_p_variable_cost').val()
  const perUnit = parseFloat($('#c_p_cost_per_unit').val())
  const numUnits = parseFloat($('#c_p_number_of_units').val())
  $('#c_cost_estimate').val(perUnit*numUnits)
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
}
function calculateC3 () {
  const o = parseFloat($('#c_3_optimistic_cost').val())
  const m = parseFloat($('#c_3_mostlikely_cost').val())
  const p = parseFloat($('#c_3_pessimistic_cost').val())
  const eq = $('#c_3_wheighting_equation').val()
  $('#c_cost_estimate').val(eval(eq))
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
$('#t_type').on('change', (e) => { setTType(e.target.value) })
$('#c_type').on('change', (e) => { setCType(e.target.value) })

// Select current values
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
