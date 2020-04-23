/* eslint-disable no-param-reassign */
import _ from 'lodash';

export const $state = () => ({
  countries: [],
});

export const $getters = {

  list(state) { return state.countries; },

  getCountryByCode({ countries }) {
    return (code) => countries.find((c) => c.Code === code.toLowerCase());
  },

  getNameByCode(state, getters) {
    return (code) => (getters.getCountryByCode(code) || {}).Name || code;
  },
};

export const $mutations = {
  setList(state, countries = []) {
    state.countries = _.sortBy(countries, (c) => c.Name.toLowerCase());
  },
};

export const $actions = {

  async initialize({ commit }) {
    const countries = await this.$kronosApi.getCountries();

    commit('setList', countries);

    return countries;
  },
};

export {
  $state     as state,
  $getters   as getters,
  $actions   as actions,
  $mutations as mutations,
};
