/* eslint-disable no-param-reassign */
import _ from 'lodash';

export const _state = () => ({
  countries: [],
});

export const _getters = {

  list(state) { return state.countries; },

  getCountryByCode({ countries }) {
    return (code) => countries.find((c) => c.Code === code.toLowerCase());
  },

  getNameByCode(state, getters) {
    return (code) => (getters.getCountryByCode(code) || {}).Name || code;
  },
};

export const _mutations = {
  setList(state, countries = []) {
    state.countries = _.sortBy(countries, (c) => c.Name.toLowerCase());
  },
};

export const _actions = {

  async initialize({ commit }) {
    const countries = await this.$kronosApi.getCountries();

    commit('setList', countries);

    return countries;
  },
};

export {
  _state as state,
  _mutations as mutations,
  _getters as getters,
  _actions as actions,
};
