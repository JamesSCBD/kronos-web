export async function getDataFromApi ({ commit, rootState }){
  const organizations  = await this.$kronosApi.getOrganizationTypes()

  commit('set', organizations)
  return organizations
}
