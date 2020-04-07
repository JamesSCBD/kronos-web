import _ from 'lodash'

export const state = () => ({
  conferences       : [],
  selectedConference: null,
  activeEvents      : []
})

export const getters = {

  list ({ conferences }){
    return conferences
  },

  selected ({ selectedConference }){
    return selectedConference
  },
    
  selectedId ({ selectedConference }){
    return (selectedConference || {})._id
  },
    
  selectedCode ({ selectedConference }){
    return (selectedConference || {}).code || (selectedConference || {})._id
  },

  majorEvents ({ activeEvents }){
    return activeEvents.filter(e => e.isMajor)
  },

  minorEvents ({ activeEvents }){
    return activeEvents.filter(e => e.isMinor)
  },

  otherEvents ({ activeEvents }){
    return activeEvents.filter(e => !e.isMajor && !e.isMinor)
  },

  events ({ activeEvents }){
    return activeEvents
  }
}

export const mutations = {

  setList (state, conferences = []){
    state.conferences = conferences
  },
  
  setSelected (state, { conference, events }){
    state.selectedConference = conference
    state.activeEvents       = events
  },
  
  clear (state){
    state.conferences = []
    state.selected = null
    state.activeEvents = []
  }
}
  
export const actions = {

  async initialize ({ dispatch, commit }, defaultConf){
    const conferences = await this.$kronosApi.getConferences()

    commit('setList', conferences)

    const _idOrCode = (defaultConf || {})._id || defaultConf
    let conference = null

    if (_idOrCode)   conference = conferences.find(c => c._id == _idOrCode || c.code == _idOrCode)
    if (!conference) conference = conferences[0]

    await dispatch('setSelected', conference)
  },
        
  async setSelected ({ state, commit }, conf){
    const _id = (conf || {})._id || conf
    const conference = state.conferences.find(c => c._id == _id)

    if (!conference)
      throw new Error(`Specified conference not found: ${_id}`)

    const activeEvents = await loadActiveEvents.call(this, conference)

    commit('setSelected', { conference, events: activeEvents })

    return conference
  }
        
}

async function loadActiveEvents (conference){
  const threeYearsAgo = new Date()

  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3)

  const majors = ((conference || {}).MajorEventIDs || []).map(id => `00000000${id}`)
  const minors = ((conference || {}).MinorEventIDs || []).map(id => `00000000${id}`)

  let majorEvents = this.$kronosApi.getMeetings({ EventUIDs: majors, EvenUIDs: majors }) // API error EvenUIDs
  let minorEvents = this.$kronosApi.getMeetings({ EventUIDs: minors, EvenUIDs: minors })
  let otherEvents = this.$kronosApi.getMeetings({ IsNeedRegistration: true, EndsAfter: threeYearsAgo })

  majorEvents = await majorEvents
  minorEvents = await minorEvents
  otherEvents = await otherEvents

  majorEvents = _.orderBy(majorEvents, [ e => majors.indexOf(e.EventUID) ], [ 'asc' ])
  minorEvents = _.orderBy(minorEvents, [ e => minors.indexOf(e.EventUID) ], [ 'asc' ])
  otherEvents = _.orderBy(otherEvents, [ 'StartDate', 'EndDate', 'Code' ], [ 'desc', 'desc', 'asc' ])

  majorEvents.forEach((e) => { e.isMajor = true })
  minorEvents.forEach((e) => { e.isMinor = true })

  const activeEvents = _.unionBy(majorEvents, minorEvents, otherEvents, e => e.EventUID)

  return activeEvents
}
