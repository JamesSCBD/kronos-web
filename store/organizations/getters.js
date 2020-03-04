export const asSelectOptions  = ({ docs }) =>  docs.map(({ Title, OrganizationTypeUID }) => ({ Title, OrganizationTypeUID }))
export const organizationNameById       = state => organizationTypeId => (byId(state)(organizationTypeId) || {}).Title

export const byId = ({ docs }) => (organizationTypeId) => {
  if (!docs || !docs.length) return false
  return docs.find(({ OrganizationTypeUID }) => OrganizationTypeUID === organizationTypeId.toLowerCase())
}
