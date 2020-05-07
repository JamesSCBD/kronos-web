import _ from 'lodash';

const $state = () => ({
  selectedContacts: [],
});

/* eslint-disable no-param-reassign */
const ADD_TO_SELECTION      = 'ADD_TO_SELECTION';
const REMOVE_FROM_SELECTION = 'REMOVE_FROM_SELECTION';
const CLEAR                 = 'CLEAR';

const $mutations = {

  [ADD_TO_SELECTION](state, contact) { // Add replace contact with the new one
    if (!contact) throw new Error('Contact is null / empty');

    state.selectedContacts = _.unionBy([ contact ], state.selectedContacts, (c) => c.ContactUID);
  },

  [REMOVE_FROM_SELECTION](state, contact) {
    if (!contact) throw new Error('Contact is null / empty');

    const contactUID = contact.ContactUID || contact; // contact object OR id

    if (!contactUID) throw new Error('ContactUID is null / empty');

    state.selectedContacts = state.selectedContacts.filter((c) => c.ContactUID !== contactUID);
  },

  [CLEAR](state) {
    state.selectedContacts = [];
  },
};
/* eslint-enable no-param-reassign */

const $getters = {

  selectedContacts(state) {
    return state.selectedContacts;
  },

  isContactSelected: ({ selectedContacts }) => (contact) => {
    const contactUID = contact.ContactUID || contact; // contact object OR id

    return selectedContacts.some((c) => c.ContactUID === contactUID);
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

};

export {
  $state     as state,
  $getters   as getters,
  $actions   as actions,
  $mutations as mutations,
};
