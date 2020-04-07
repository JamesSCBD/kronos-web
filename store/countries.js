import _ from 'lodash'

export const state = () => ({
  countries: []
})

export const getters   = {

  list (state){ return state.countries },
    
  getCountryByCode (state){
    return code => state.countries.find(c => c.Code == code.toLowerCase())
  },

  getNameByCode (state, getters){
    return code => (getters.getCountryByCode(code) || {}).Name || code
  }
}

export const mutations = {
  setList (state, countries = []){
    state.countries = _.sortBy(countries, c => c.Name.toLowerCase())
  }
}

export const actions = {

  async initialize ({ commit }){
    const countries = await this.$kronosApi.getCountries()

    commit('setList', countries)

    return countries
  }
}
