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
    return (id) => activeEvents.find((o) => o.EventUID === id);
  },
  getEventByCode({ activeEvents }) {
    return (code) => activeEvents.find((o) => o.Code === code);
  },
  getEventCodeById({ activeEvents }) {
    return (id) => (activeEvents.find((o) => o.EventUID === id) || {}).Code || id;
  },
};

/* eslint-disable no-param-reassign */
const $mutations = {

  setList(state, conferences = []) {
    state.conferences = conferences;
  },

  setSelected(state, { conference, events }) {
    state.selectedConference = conference;
    state.activeEvents       = events;
  },

  clear(state) {
    state.conferences  = [];
    state.selected     = null;
    state.activeEvents = [];
  },
};
/* eslint-enable no-param-reassign */

const $actions = {

  async initialize({ dispatch, commit }, defaultConf) {
    const conferences = await this.$kronosApi.getConferences();

    commit('setList', conferences);

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

    commit('setSelected', { conference, events: activeEvents });

    return conference;
  },

};

async function loadActiveEvents(conference) {
  const threeYearsAgo = new Date();

  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

  const majors = ((conference || {}).MajorEventIDs || []).map((id) => `00000000${id}`);
  const minors = ((conference || {}).MinorEventIDs || []).map((id) => `00000000${id}`);

  let majorEvents = this.$kronosApi.getMeetings({ EventUIDs: majors, EvenUIDs: majors }); // API error EvenUIDs
  let minorEvents = this.$kronosApi.getMeetings({ EventUIDs: minors, EvenUIDs: minors });
  let otherEvents = this.$kronosApi.getMeetings({ IsNeedRegistration: true, EndsAfter: threeYearsAgo });

  majorEvents = await majorEvents;
  minorEvents = await minorEvents;
  otherEvents = await otherEvents;

  majorEvents = _.orderBy(majorEvents, [ (e) => majors.indexOf(e.EventUID) ], [ 'asc' ]);
  minorEvents = _.orderBy(minorEvents, [ (e) => minors.indexOf(e.EventUID) ], [ 'asc' ]);
  otherEvents = _.orderBy(otherEvents, [ 'StartDate', 'EndDate', 'Code' ], [ 'desc', 'desc', 'asc' ]);

  majorEvents.forEach((e) => { e.isMajor = true; });
  minorEvents.forEach((e) => { e.isMinor = true; });

  const activeEvents = _.unionBy(majorEvents, minorEvents, otherEvents, (e) => e.EventUID);

  return activeEvents;
}

export {
  $state     as state,
  $getters   as getters,
  $actions   as actions,
  $mutations as mutations,
};
