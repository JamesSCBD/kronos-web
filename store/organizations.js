import _ from 'lodash';
import { enableCursor } from '~/api/kronos';

const $state = () => ({
  organizationCache    : [],
  organizationTypes    : [],
  selectedOrganizations: [],
});

/* eslint-disable no-param-reassign */
const SET_TYPE_LIST         = 'SET_TYPE_LIST';
const UPDATE_CACHE          = 'UPDATE_CACHE';
const ADD_TO_SELECTION      = 'ADD_TO_SELECTION';
const REMOVE_FROM_SELECTION = 'REMOVE_FROM_SELECTION';
const CLEAR                 = 'CLEAR';
const CLEAR_SELECTION       = 'CLEAR_SELECTION';

const $mutations = {

  [SET_TYPE_LIST](state, types = []) {
    state.organizationTypes = _.sortBy(types, (c) => c.title.toLowerCase());
  },

  [UPDATE_CACHE](state, organizations = []) {
    state.organizationCache = _.unionBy(organizations, state.organizationCache, (o) => o.organizationId);
  },

  [ADD_TO_SELECTION](state, organization) {
    if (!organization) throw new Error('Organization is null / empty');

    state.selectedOrganizations = _.unionBy([ organization ], state.selectedOrganizations, (o) => o.organizationId);
  },

  [REMOVE_FROM_SELECTION](state, organization) {
    if (!organization) throw new Error('Organization is null / empty');

    const organizationId = organization.organizationId || organization; // organization object OR id

    if (!organizationId) throw new Error('organizationId is null / empty');

    state.selectedOrganizations = state.selectedOrganizations.filter((c) => c.organizationId !== organizationId);
  },

  [CLEAR](state) {
    state.organizationCache     = [];
    state.organizationTypes     = [];
    state.selectedOrganizations = [];
  },

  [CLEAR_SELECTION](state) {
    state.selectedOrganizations = [];
  },
};
/* eslint-enable no-param-reassign */

const $getters = {

  types({ organizationTypes }) {
    return organizationTypes;
  },

  getTypeById(state) {
    return (id) => state.organizationTypes.find((t) => t.organizationTypeId === id);
  },

  getOrganizationById(state) {
    return (id) => state.organizationCache.find((t) => t.organizationId === id);
  },

  isOrganizationSelected: ({ selectedOrganizations }) => (organization) => {
    const organizationId = organization.organizationId || organization; // organization object OR id

    return selectedOrganizations.some((c) => c.organizationId === organizationId);
  },

  selectedCount(state) {
    return state.selectedOrganizations.length;
  },

  selectedOrganizations(state) {
    return state.selectedOrganizations;
  },

  selectedOrganizationsResult(state) {
    const records       = state.selectedOrganizations || [];
    const virtualResult = {
      records,
      recordCount     : records.length,
      totalRecordCount: records.length,
    };

    return enableCursor(virtualResult);
  },
};

const $actions = {
  async initialize({ commit }) {
    commit(CLEAR);

    const types = await this.$kronosApi.getOrganizationTypes();

    commit(SET_TYPE_LIST, types);

    return types;
  },

  async queryOrganizations({ commit }, query) {
    const organizations = await this.$kronosApi.queryOrganizations(query);

    if (organizations) commit(UPDATE_CACHE, organizations.records);

    return organizations;
  },

  async getOrganizationById({ commit }, id) {
    const organization = await this.$kronosApi.getOrganization(id);

    if (organization) commit(UPDATE_CACHE, [ organization ]);

    return organization;
  },

  //= ============================================
  // Add / replace organization with the new one into the selection
  //= ============================================
  addToSelection({ commit }, organization) {
    commit(ADD_TO_SELECTION, organization);
  },

  //= ============================================
  // Remove specified organization from the selection.
  //= ============================================
  removeFromSelection({ commit }, organization) {
    commit(REMOVE_FROM_SELECTION, organization);
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
