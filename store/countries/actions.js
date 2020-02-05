export async function getDataFromApi ({ commit, rootState }){
  const countries  = await this.$kronosApi.getCountries()

  commit('set', countries)

  return countries
}
