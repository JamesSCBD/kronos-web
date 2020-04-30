import _ from 'lodash';

const $state = () => ({
  organizationCache    : [],
  organizationTypes    : [],
  selectedOrganizations: [],
});

/* eslint-disable no-param-reassign */
const $mutations = {
  setTypes(state, types = []) {
    state.organizationTypes = _.sortBy(types, (c) => c.Title.toLowerCase());
  },
  updateOrganizationCache(state, organizations = []) {
    state.organizationCache = _.unionBy(organizations, state.organizationCache, (o) => o.OrganizationUID);
  },

  clear(state) {
    state.selectedOrganizations = [];
  },

  add(state, organization) {
    if (!organization) throw new Error('Organization is null / empty');

    state.selectedOrganizations = _.unionBy([ organization ], state.selectedOrganizations, (o) => o.OrganizationUID);
  },

  remove(state, organization) {
    if (!organization) throw new Error('Organization is null / empty');

    const organizationUID = organization.OrganizationUID || organization; // organization object OR id

    if (!organizationUID) throw new Error('OrganizationUID is null / empty');

    state.selectedOrganizations = state.selectedOrganizations.filter((c) => c.OrganizationUID !== organizationUID);
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
};

const $actions = {
  async initialize({ commit }) {
    const types = await this.$kronosApi.getOrganizationTypes();

    commit('setTypes', types);

    return types;
  },

  async getOrganizations({ commit }, query) {
    const organizations = await this.$kronosApi.getOrganizations(query);

    if (organizations.length) commit('updateOrganizationCache', organizations);

    return organizations;
  },

  async getOrganizationById({ commit }, id) {
    const organization = await this.$kronosApi.getOrganization(id);

    if (organization) commit('updateOrganizationCache', [ organization ]);

    return organization;
  },

  //= ============================================
  // Add / replace organization with the new one into the selection
  //= ============================================
  addToSelection({ commit }, organization) {
    commit('add', organization);
  },

  //= ============================================
  // Remove specified organization from the selection.
  //= ============================================
  removeFromSelection({ commit }, organization) {
    commit('remove', organization);
  },

};

export {
  $state     as state,
  $getters   as getters,
  $actions   as actions,
  $mutations as mutations,
};
