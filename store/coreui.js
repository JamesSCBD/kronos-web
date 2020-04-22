/* eslint-disable no-param-reassign */
const _state = () => ({
  sideBar: {
    show: true,
    min : false,
  },
});

const _getters = {
  isMin({ sideBar }) {
    return sideBar.min;
  },

  isShow({ sideBar }) {
    return sideBar.show;
  },
};

const _mutations = {
  sideBarShowToggle(state) {
    state.sideBar.show = !state.sideBar.show;
  },
  sideBarMinToggle(state) {
    state.sideBar.min = !state.sideBar.min;
  },
};

export {
  _state as state,
  _mutations as mutations,
  _getters as getters,
};
