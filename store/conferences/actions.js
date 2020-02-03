import { byCode } from './getters'

// ACTIONS
export async function getDataFromApi ({ state,  commit, rootState }, query){
  if (state.selected) return state.docs

  const { $http, $router } = this
  const { conferenceCode } = $router.currentRoute.params
  const   response         = await queryConferences($http, rootState.i18n, query)

  commit('set', response)

  initSelectedConference({ state, commit }, { conferenceCode })

  return response
}

function queryConferences ($http, { locale = 'en' } = {}){
  const searchParams = new URLSearchParams({ s: JSON.stringify({ StartDate: -1 }) })

  return $http.$get(`${process.env.NUXT_ENV_API}/api/v2016/conferences`, { searchParams })
}

function initSelectedConference ({ state, commit }, { conferenceCode }){
  if (state.selected) return

  //TODO - calculate the meeting currently going as default or the next one after todays date.
  commit('setSelected', conferenceCode ? byCode(state)(conferenceCode) : state.docs[0])
}
