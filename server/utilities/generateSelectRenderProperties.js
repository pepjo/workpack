
module.exports = function generateSelectRenderProperties (work) {
  work.ttypep = work.t_type === 't_p' ? ' selected="selected"' : ''
  work.ttypea = work.t_type === 't_a' ? ' selected="selected"' : ''
  work.ttype3 = work.t_type === 't_3' ? ' selected="selected"' : ''
  work.ctypep = work.c_type === 'c_p' ? ' selected="selected"' : ''
  work.ctypea = work.c_type === 'c_a' ? ' selected="selected"' : ''
  work.ctype3 = work.c_type === 'c_3' ? ' selected="selected"' : ''

  work.type_task = work.wsb_type === 'Task' ? ' selected="selected"' : ''
  work.type_WPt = work.wsb_type === 'WP with tasks' ? ' selected="selected"' : ''
  work.type_WPh = work.wsb_type === 'WP higher level' ? ' selected="selected"' : ''

  work.relationship_p_FS = work.relationship_p === 'FS' ? ' selected="selected"' : ''
  work.relationship_p_FF = work.relationship_p === 'FF' ? ' selected="selected"' : ''
  work.relationship_p_SS = work.relationship_p === 'SS' ? ' selected="selected"' : ''
  work.relationship_p_SF = work.relationship_p === 'SF' ? ' selected="selected"' : ''
  work.relationship_s_FS = work.relationship_s === 'FS' ? ' selected="selected"' : ''
  work.relationship_s_FF = work.relationship_s === 'FF' ? ' selected="selected"' : ''
  work.relationship_s_SS = work.relationship_s === 'SS' ? ' selected="selected"' : ''
  work.relationship_s_SF = work.relationship_s === 'SF' ? ' selected="selected"' : ''

  return work
}
