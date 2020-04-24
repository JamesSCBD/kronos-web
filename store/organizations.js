import _ from 'lodash';

const $state = () => ({
  organizationCache: [],
  organizationTypes: [],
});

/* eslint-disable no-param-reassign */
const $mutations = {
  setTypes(state, types = []) {
    state.organizationTypes = _.sortBy(types, (c) => c.Title.toLowerCase());
  },
  updateOrganizationCache(state, organizations = []) {
    state.organizationCache = _.unionBy(organizations, state.organizationCache, (o) => o.OrganizationUID);
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

};

export {
  $state     as state,
  $getters   as getters,
  $actions   as actions,
  $mutations as mutations,
};
