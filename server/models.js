
module.exports = function (bookshelf) {
  const Group = bookshelf.Model.extend({
    tableName: 'groups',
    workpacks () {
      return this.hasMany(Workpack, 'groups_id')
    }
  })

  const Resource = bookshelf.Model.extend({
    tableName: 'resources',
    calculateAmountsinTasks () {
      const workpacks = this.relations.workpacks.toJSON();
      (this.attributes || {}).maxAmountinTasks = workpacks
      .reduce((max, item) => (
        item._pivot_amount > max ? item._pivot_amount : max
      ), 0);
      (this.attributes || {}).totalAmountinTasks = workpacks
      .reduce((total, item) => (
        total + item._pivot_amount
      ), 0)
    },
    workpacks () {
      return this.belongsToMany(Workpack, 'workpacks_resources', 'resource_id', 'workpack_id').withPivot(['amount'])
    },
  })

  const ParamCost = bookshelf.Model.extend({
    tableName: 'parametric_costs',
    workpacks () {
      return this.belongsTo(Workpack)
    },
  })

  const Workpack = bookshelf.Model.extend({
    tableName: 'workpacks',
    group () {
      return this.belongsTo(Group, 'groups_id')
    },
    parent () {
      return this.belongsTo(Workpack, 'parent')
    },
    childs () {
      return this.hasMany(Workpack, 'parent')
    },
    predecessors () {
      return this.belongsToMany(Workpack, 'workpacks_workpacks', 'owner_id', 'predecessor_id')
      .withPivot(['relation', 'lag'])
    },
    successors () {
      return this.belongsToMany(Workpack, 'workpacks_workpacks', 'predecessor_id', 'owner_id')
      .withPivot(['relation', 'lag'])
    },
    resources () {
      return this.belongsToMany(Resource, 'workpacks_resources', 'workpack_id', 'resource_id').withPivot(['amount'])
    },
    paramCosts () {
      return this.hasMany(ParamCost)
    },
    calculateWPResources () {
      if (this.attributes.wsb_type === 'WP with tasks') {
        const childs = this.relations.childs.toJSON()
        const isSerial = this.attributes.automatic_resources_mode === 'serial'
        const isParallel = this.attributes.automatic_resources_mode === 'parallel'
        if (isSerial || isParallel) {
          (this.attributes || {}).computedResources = childs.reduce((resources, child) => {
            child.resources.forEach((resource) => {
              const resourceIndex = resources.findIndex((item) => (item.id === resource.id))
              if (resourceIndex === -1) {
                resources.push(resource)
              } else if (isSerial && resource._pivot_amount > resources[resourceIndex]._pivot_amount) {
                resources[resourceIndex]._pivot_amount = resource._pivot_amount
              } else if (isParallel) {
                resources[resourceIndex]._pivot_amount += resource._pivot_amount
              }
            })
            return resources
          }, [])
        } else { // manual
          (this.attributes || {}).computedResources = (this.attributes || {}).resources
        }
      }
    }
  })

  const Workpacks = bookshelf.Collection.extend({
    model: Workpack
  })
  const ParamCosts = bookshelf.Collection.extend({
    model: ParamCost
  })

  global.models = { Group, Resource, Workpack, Workpacks, ParamCost, ParamCosts }
}
