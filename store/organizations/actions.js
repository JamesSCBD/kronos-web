export async function getDataFromApi ({ commit, rootState }){
  const organizations  = await this.$kronosApi.getOrganizationTypes()

  debugger
  commit('set', organizations)
  return organizations
}
