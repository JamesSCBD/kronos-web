import _ from 'lodash';

const $state = () => ({
  organizationCache    : [],
  organizationTypes    : [],
  selectedOrganizations: [],
  selectedQuery        : null,
  selectedCount        : 0,
});

/* eslint-disable no-param-reassign */
const SET_TYPE_LIST         = 'SET_TYPE_LIST';
const UPDATE_CACHE          = 'UPDATE_CACHE';
const ADD_TO_SELECTION      = 'ADD_TO_SELECTION';
const REMOVE_FROM_SELECTION = 'REMOVE_FROM_SELECTION';
const CLEAR                 = 'CLEAR';
const SAVE_SELECTED_QUERY   = 'SAVE_SELECTED_QUERY';
const CLEAR_SELECTION       = 'CLEAR_SELECTION';

const $mutations = {

  [SET_TYPE_LIST](state, types = []) {
    state.organizationTypes = _.sortBy(types, (c) => c.Title.toLowerCase());
  },

  [UPDATE_CACHE](state, organizations = []) {
    state.organizationCache = _.unionBy(organizations, state.organizationCache, (o) => o.OrganizationUID);
  },

  [ADD_TO_SELECTION](state, organization) {
    if (!organization) throw new Error('Organization is null / empty');

    state.selectedQuery         = null;
    state.selectedOrganizations = _.unionBy([ organization ], state.selectedOrganizations, (o) => o.OrganizationUID);
    state.selectedCount         = state.selectedOrganizations.length;
  },

  [REMOVE_FROM_SELECTION](state, organization) {
    if (!organization) throw new Error('Organization is null / empty');

    const organizationUID = organization.OrganizationUID || organization; // organization object OR id

    if (!organizationUID) throw new Error('OrganizationUID is null / empty');

    state.selectedQuery         = null;
    state.selectedOrganizations = state.selectedOrganizations.filter((c) => c.OrganizationUID !== organizationUID);
    state.selectedCount         = state.selectedOrganizations.length;
  },

  [CLEAR](state) {
    state.organizationCache     = [];
    state.organizationTypes     = [];
    state.selectedOrganizations = [];
    state.selectedQuery         = null;
    state.selectedCount         = 0;
  },

  [SAVE_SELECTED_QUERY](state, { query, count }) {
    if (!query) throw new Error('query is null / empty');

    state.selectedOrganizations = [];
    state.selectedQuery         = query;
    state.selectedCount         = count || 0;
  },

  [CLEAR_SELECTION](state) {
    state.selectedOrganizations = [];
    state.selectedQuery         = null;
    state.selectedCount         = 0;
  },
};
/* eslint-enable no-param-reassign */

const $getters = {

  types({ organizationTypes }) {
    return organizationTypes;
  },

  getTypeById(state) {
    return (id) => state.organizationTypes.find((t) => t.OrganizationTypeUID === id);
  },

  getOrganizationById(state) {
    return (id) => state.organizationCache.find((t) => t.OrganizationUID === id);
  },

  isOrganizationSelected: ({ selectedOrganizations }) => (organization) => {
    const organizationUID = organization.OrganizationUID || organization; // organization object OR id

    return selectedOrganizations.some((c) => c.OrganizationUID === organizationUID);
  },

  selectedQuery(state) {
    return state.selectedQuery || null;
  },

  selectedCount(state) {
    return state.selectedCount;
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

  async setSelectedQuery({ commit }, organizationQuery) {
    const query    = { ...organizationQuery };
    const response = await this.$kronosApi.queryOrganizations({ ...query,  limit: 1 });
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
