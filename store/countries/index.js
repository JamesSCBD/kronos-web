import { byCode, asSelectOptions, nameByCode } from './getters'
import { set, clear                          } from './mutations'
import { getDataFromApi                      } from './actions'

export const state     = () => ({ docs: [] })
export const getters   = { byCode, asSelectOptions,  nameByCode  }
export const mutations = { set, clear }
export const actions   = { getDataFromApi }
