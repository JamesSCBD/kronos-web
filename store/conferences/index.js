import { selected, selectedCode, byCode, asSelectOptions, selectedAsOption } from './getters'
import { set, setSelected, clear                                           } from './mutations'
import { getDataFromApi                                                    } from './actions'

export const state     = () => ({ docs: [], selected: false })
export const getters   = { selected, selectedCode, byCode, asSelectOptions, selectedAsOption }
export const mutations = { setSelected, set, clear }
export const actions   = { getDataFromApi }
