import { DateTime } from 'luxon'

const dateFormatter = v => DateTime.fromISO(v).toFormat('dd LLL yyyy HH:mm') // 13 Jan 2020 20:34

// common fields
export const score    = { key: 'Score', label: 'Rank'  }
export const meta     = { key: 'meta', label: 'Updated'  }
export const actions  = { key: 'identifier', label: ' ' }
export const Country  = { key: 'Country', label: 'Country', class: 'text-center' }
export const OrganizationName     = { key: 'OrganizationName', label: 'Organization' }

// contacts
export const fullName = { key: 'fullName', label: 'Name' }

// organization
export const OrganizationAcronym  = { key: 'OrganizationAcronym', label: 'Acronym' }
export const MemberCount          = { key: 'MemberCount', label: '# of Members' }
export const EventCount           = { key: 'EventCount', label: '# of Events' }

// conferences
export const Title        = { key: 'Title', label: 'Title', sortable: true }
export const code         = { key: 'code', label: 'Code', sortable: true }
export const Description  = { key: 'Description', label: 'Description', sortable: true }
export const StartDate    = { key: 'StartDate', label: 'Start', sortable: true, formatter: dateFormatter }
export const EndDate      = { key: 'EndDate', label: 'End', sortable: true, formatter: dateFormatter }
export const institution  = { key: 'institution', label: 'Institution', sortable: true }
export const timezone     = { key: 'timezone', label: 'Timezone', sortable: true }
