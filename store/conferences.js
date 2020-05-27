import _ from 'lodash';

const $state = () => ({
  conferences       : [],
  selectedConference: null,
  activeEvents      : [],
});

const $getters = {

  list({ conferences }) {
    return conferences;
  },

  selected({ selectedConference }) {
    return selectedConference;
  },

  selectedId({ selectedConference }) {
    return (selectedConference || {})._id;
  },

  selectedCode({ selectedConference }) {
    return (selectedConference || {}).code || (selectedConference || {})._id;
  },

  majorEvents({ activeEvents }) {
    return activeEvents.filter((e) => e.isMajor);
  },

  minorEvents({ activeEvents }) {
    return activeEvents.filter((e) => e.isMinor);
  },

  otherEvents({ activeEvents }) {
    return activeEvents.filter((e) => !e.isMajor && !e.isMinor);
  },

  events({ activeEvents }) {
    return activeEvents;
  },

  getEventById({ activeEvents }) {
    return (id) => activeEvents.find((o) => o.eventId === id);
  },
  getEventByCode({ activeEvents }) {
    return (code) => activeEvents.find((o) => o.code === code);
  },
  getEventCodeById({ activeEvents }) {
    return (id) => (activeEvents.find((o) => o.eventId === id) || {}).code || id;
  },
};

/* eslint-disable no-param-reassign */
const SET_LIST     = 'SET_LIST';
const SET_SELECTED = 'SET_SELECTED';
const CLEAR        = 'CLEAR';

const $mutations = {

  [SET_LIST](state, conferences = []) {
    state.conferences = conferences;
  },

  [SET_SELECTED](state, { conference, events }) {
    state.selectedConference = conference;
    state.activeEvents       = events;
  },

  [CLEAR](state) {
    state.conferences  = [];
    state.selected     = null;
    state.activeEvents = [];
  },
};
/* eslint-enable no-param-reassign */

const $actions = {

  async initialize({ dispatch, commit }, defaultConf) {
    const response    = await this.$kronosApi.queryConferences();
    const conferences = response.records;

    commit(SET_LIST, conferences);

    const idOrCode = (defaultConf || {})._id || defaultConf;
    let conference = null;

    if (idOrCode) conference = conferences.find((c) => c._id === idOrCode || c.code === idOrCode);
    if (!conference) [ conference ] = conferences;

    await dispatch('setSelected', conference);
  },

  async setSelected({ state, commit }, conf) {
    const _id        = (conf || {})._id || conf;
    const conference = state.conferences.find((c) => c._id === _id);

    if (!conference) throw new Error(`Specified conference not found: ${_id}`);

    const activeEvents = await loadActiveEvents.call(this, conference);

    commit(SET_SELECTED, { conference, events: activeEvents });

    return conference;
  },

};

async function loadActiveEvents(conference) {
  const threeYearsAgo = new Date();

  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

  const majors = ((conference || {}).MajorEventIDs || []).map((id) => `00000000${id}`);
  const minors = ((conference || {}).MinorEventIDs || []).map((id) => `00000000${id}`);

  let majorEvents =  this.$kronosApi.queryEvents({ eventIds: majors, evenIds: majors }); // API error evenIds
  let minorEvents =  this.$kronosApi.queryEvents({ eventIds: minors, evenIds: minors });
  let otherEvents =  this.$kronosApi.queryEvents({ isNeedRegistration: true, endsAfter: threeYearsAgo });

  majorEvents =  (await majorEvents).records;
  minorEvents =  (await minorEvents).records;
  otherEvents =  (await otherEvents).records;

  majorEvents = _.orderBy(majorEvents, [ (e) => majors.indexOf(e.eventId) ], [ 'asc' ]);
  minorEvents = _.orderBy(minorEvents, [ (e) => minors.indexOf(e.eventId) ], [ 'asc' ]);
  otherEvents = _.orderBy(otherEvents, [ 'startDate', 'endDate', 'code' ], [ 'desc', 'desc', 'asc' ]);

  majorEvents.forEach((e) => { e.isMajor = true; });
  minorEvents.forEach((e) => { e.isMinor = true; });

  const activeEvents = _.unionBy(majorEvents, minorEvents, otherEvents, (e) => e.eventId);

  return activeEvents;
}

export {
  $state     as state,
  $getters   as getters,
  $actions   as actions,
  $mutations as mutations,
};
