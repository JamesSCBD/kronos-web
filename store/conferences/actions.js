import ky from 'ky'
import { byCode } from './getters'

// ACTIONS
export async function getDataFromApi ({ state,  commit, rootState }, query){
  if (state.selected) return state.docs

  const { $router } = this
  const { conferenceCode } = $router.currentRoute.params
  const   response         = await queryConferences(rootState.i18n, query)

  commit('set', response)

  initSelectedConference({ state, commit }, { conferenceCode })

  return response
}

function queryConferences ({ locale = 'en' } = {}){
  const searchParams = new URLSearchParams({ s: JSON.stringify({ StartDate: -1 }) })

  return ky.get(`${process.env.NUXT_ENV_API}/api/v2016/conferences`, { searchParams }).json()
}

function initSelectedConference ({ state, commit }, { conferenceCode }){
  if (state.selected) return

  //TODO - calculate the meeting currently going as default or the next one after todays date.
  commit('setSelected', conferenceCode ? byCode(state)(conferenceCode) : state.docs[0])
}
