
const Fields = require('bookshelf-schema/lib/fields')
const Relations = require('bookshelf-schema/lib/relations')

module.exports = function (bookshelf) {
  const Group = bookshelf.Model.extend({
    tableName: 'groups',
  }, {
    schema: [
      Fields.IntField('id'),
      Fields.StringField('code'),
      Fields.StringField('name'),
    ]
  })

  const Workpack = bookshelf.Model.extend({
    tableName: 'workpacks',
  }, {
    schema: [
      Fields.IntField('id'),
      Fields.IntField('order'),
      Relations.BelongsTo(Group),
      Fields.StringField('wsb_id'),
      Fields.StringField('activity'),
      Fields.StringField('description_of_work'),
      Fields.StringField('predecessors'),
      Fields.StringField('relationship_p'),
      Fields.StringField('lag_p'),
      Fields.StringField('successor'),
      Fields.StringField('relationship_s'),
      Fields.StringField('lag_s'),
      Fields.StringField('number_resources'),
      Fields.StringField('skill_requirements'),
      Fields.StringField('other_required_ressources'),
      Fields.StringField('type_of_effort'),
      Fields.StringField('location_performance'),
      Fields.StringField('constrains'),
      Fields.StringField('assumptions'),
      Fields.StringField('t_type'),
      Fields.FloatField('t_duration_estimate'),
      Fields.FloatField('t_p_effort_hours'),
      Fields.FloatField('t_p_resource_quantity'),
      Fields.FloatField('t_p_percentage_avaiable'),
      Fields.FloatField('t_p_performance_factor'),
      Fields.FloatField('t_a_previous_activity'),
      Fields.FloatField('t_a_previous_duration'),
      Fields.FloatField('t_a_current_activity'),
      Fields.FloatField('t_a_multiplier'),
      Fields.StringField('t_a_previous_activity_txt'),
      Fields.StringField('t_a_previous_duration_txt'),
      Fields.StringField('t_a_current_activity_txt'),
      Fields.StringField('t_a_multiplier_txt'),
      Fields.FloatField('t_3_optimistic_duration'),
      Fields.FloatField('t_3_mostlikely_duration'),
      Fields.FloatField('t_3_pessimistic_duration'),
      Fields.StringField('t_3_wheighting_equation'),
      Fields.StringField('c_type'),
      Fields.FloatField('c_cost_estimate'),
      Fields.StringField('c_p_variable_cost'),
      Fields.FloatField('c_p_cost_per_unit'),
      Fields.FloatField('c_p_number_of_units'),
      Fields.FloatField('c_a_previous_activity'),
      Fields.StringField('c_a_previous_activity_txt'),
      Fields.FloatField('c_a_previous_cost'),
      Fields.FloatField('c_a_current_activity'),
      Fields.StringField('c_a_current_activity_txt'),
      Fields.FloatField('c_a_multiplier'),
      Fields.FloatField('c_3_optimistic_cost'),
      Fields.FloatField('c_3_mostlikely_cost'),
      Fields.FloatField('c_3_pessimistic_cost'),
      Fields.StringField('c_3_wheighting_equation'),
    ]
  })

  return { Group, Workpack }
}
