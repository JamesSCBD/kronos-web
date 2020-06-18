import _ from 'lodash';
import { enableCursor } from '~/api/kronos';

const $state = () => ({
  selectedContacts: [],
});

/* eslint-disable no-param-reassign */
const ADD_TO_SELECTION      = 'ADD_TO_SELECTION';
const REMOVE_FROM_SELECTION = 'REMOVE_FROM_SELECTION';
const CLEAR                 = 'CLEAR';
const CLEAR_SELECTION       = 'CLEAR_SELECTION';

const $mutations = {

  [ADD_TO_SELECTION](state, contact) { // Add replace contact with the new one
    if (!contact) throw new Error('Contact is null / empty');

    state.selectedContacts = _.unionBy([ contact ], state.selectedContacts, (c) => c.contactId);
  },

  [REMOVE_FROM_SELECTION](state, contact) {
    if (!contact) throw new Error('Contact is null / empty');

    const contactId = contact.contactId || contact; // contact object OR id

    if (!contactId) throw new Error('contactId is null / empty');

    state.selectedContacts = state.selectedContacts.filter((c) => c.contactId !== contactId);
  },

  [CLEAR](state) {
    state.selectedContacts = [];
  },

  [CLEAR_SELECTION](state) {
    state.selectedContacts = [];
  },
};
/* eslint-enable no-param-reassign */

const $getters = {

  selectedContacts(state) {
    return state.selectedContacts;
  },

  selectedContactResult(state) {
    const records       = state.selectedContacts || [];
    const virtualResult = {
      records,
      recordCount     : records.length,
      totalRecordCount: records.length,
    };

    return enableCursor(virtualResult);
  },

  isContactSelected: ({ selectedContacts }) => (contact) => {
    const contactId = contact.contactId || contact; // contact object OR id

    return selectedContacts.some((c) => c.contactId === contactId);
  },

  selectedCount(state) {
    return state.selectedContacts.length;
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
