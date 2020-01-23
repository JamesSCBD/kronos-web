export const asSelectOptions  = ({ docs }) =>  docs.map(({ Name, Code }) => ({ Name, Code }))
export const nameByCode       = state => code => (byCode(state)(code) || {}).Name

export const byCode = ({ docs }) => (code) => {
  if (!docs || !docs.length) return false
  
  return docs.find(({ Code }) => Code === code.toLowerCase())
}
