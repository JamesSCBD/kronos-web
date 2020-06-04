import _ from 'lodash';
import KronosApi, { enableCursor } from '~/api/kronos';

const $state = () => ({
  selectedContacts: [],
  selectedQuery   : null,
  selectedCount   : 0,
});

/* eslint-disable no-param-reassign */
const ADD_TO_SELECTION      = 'ADD_TO_SELECTION';
const REMOVE_FROM_SELECTION = 'REMOVE_FROM_SELECTION';
const CLEAR                 = 'CLEAR';
const SAVE_SELECTED_QUERY   = 'SAVE_SELECTED_QUERY';
const CLEAR_SELECTION       = 'CLEAR_SELECTION';

const $mutations = {

  [ADD_TO_SELECTION](state, contact) { // Add replace contact with the new one
    if (!contact) throw new Error('Contact is null / empty');

    state.selectedQuery    = null;
    state.selectedContacts = _.unionBy([ contact ], state.selectedContacts, (c) => c.contactId);
    state.selectedCount    = state.selectedContacts.length;
  },

  [REMOVE_FROM_SELECTION](state, contact) {
    if (!contact) throw new Error('Contact is null / empty');

    const contactId = contact.contactId || contact; // contact object OR id

    if (!contactId) throw new Error('contactId is null / empty');

    state.selectedQuery    = null;
    state.selectedContacts = state.selectedContacts.filter((c) => c.contactId !== contactId);
    state.selectedCount    = state.selectedContacts.length;
  },

  [CLEAR](state) {
    state.selectedContacts = [];
    state.selectedQuery    = null;
    state.selectedCount    = 0;
  },

  [SAVE_SELECTED_QUERY](state, { query, count }) {
    if (!query) throw new Error('query is null');

    state.selectedContacts = [];
    state.selectedQuery    = query;
    state.selectedCount    = count || 0;
  },

  [CLEAR_SELECTION](state) {
    state.selectedContacts = [];
    state.selectedQuery    = null;
    state.selectedCount    = 0;
  },
};
/* eslint-enable no-param-reassign */

const $getters = {

  selectedContacts(state) {
    return state.selectedContacts;
  },

  selectedContactResult(state, getters, rootState) {
    const records       = state.selectedContacts || [];
    const virtualResult = {
      records,
      recordCount     : records.length,
      totalRecordCount: state.selectedCount,
    };

    if (state.selectedQuery) {
      const kronosApi = new KronosApi(() => rootState.auth.token);

      return enableCursor(virtualResult, { ...state.selectedQuery, skip: 0, limit: 50 }, (q) => kronosApi.queryContacts(q));
    }

    return enableCursor(virtualResult);
  },

  isContactSelected: ({ selectedContacts }) => (contact) => {
    const contactId = contact.contactId || contact; // contact object OR id

    return selectedContacts.some((c) => c.contactId === contactId);
  },

  selectedQuery(state) {
    return state.selectedQuery || null;
  },

  selectedCount(state) {
    return state.selectedCount;
  },
};

const $actions = {
  initialize({ commit }) {
    commit(CLEAR);
  },

  //= ============================================
  // Add / replace contact with the new one into the selection
  //= ============================================
  addToSelection({ commit }, contact) {
    commit(ADD_TO_SELECTION, contact);
  },

  //= ============================================
  // Remove specified contact from the selection.
  //= ============================================
  removeFromSelection({ commit }, contact) {
    commit(REMOVE_FROM_SELECTION, contact);
  },

  async setSelectedQuery({ commit }, contactQuery) {
    const query    = { ...contactQuery };
    const response = await this.$kronosApi.queryContacts({ ...query, skip: 0, limit: 1 });
    const count    = response.totalRecordCount;
    commit(SAVE_SELECTED_QUERY, { query, count });
  },

  clearSelection({ commit }) {
    commit(CLEAR_SELECTION);
  },
};

export {
  $state     as state,
  $getters   as getters,
  $actions   as actions,
  $mutations as mutations,
};
