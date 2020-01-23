export async function getDataFromApi ({ commit, rootState }){
  const response  = await query(this.$http, rootState.i18n)

  commit('set', response)

  return response
}

function query ($http, { locale = 'en' } = {}){ return $http.$get(`${process.env.NUXT_ENV_KRONOS_API}/api/v2018/countries`) }
