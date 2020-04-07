import _ from 'lodash'

export const state = {
  organizationTypes: []
}

export const mutations = {
  setTypes (state, types = []){
    state.organizationTypes = _.sortBy(types, c => c.Title.toLowerCase())
  }
}

export const getters = {

  types ({ organizationTypes }){
    return organizationTypes
  },
      
  typeById (state){
    return id => state.organizationTypes.find(t => t.OrganizationTypeUID == id)
  }
}

export const actions = {
  async initialize ({ commit }){
    const types  = await this.$kronosApi.getOrganizationTypes()

    commit('setTypes', types)

    return types
  }
}
