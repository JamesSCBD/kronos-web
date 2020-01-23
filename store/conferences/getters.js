export const selected         = ({ selected }) => selected
export const selectedCode     = ({ selected }) => selected ? selected.code || selected._id : selected
export const asSelectOptions  = ({ docs })     => docs.map(({ title, code }) => ({ title, code }))
export const selectedAsOption = ({ selected }) => selected ? { title: selected.title, code: selected.code } : {}

export const byCode = state => (code) => {
  if (!state.docs || !state.docs.length) return false
  return state.docs.find(conf => conf.code === code || conf._id === code)
}
