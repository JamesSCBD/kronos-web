const $state = () => ({
  sideBar: {
    show: true,
    min : false,
  },
});

const $getters = {
  isMin({ sideBar }) {
    return sideBar.min;
  },

  isShow({ sideBar }) {
    return sideBar.show;
  },
};

/* eslint-disable no-param-reassign */
const $mutations = {
  sideBarShowToggle(state) {
    state.sideBar.show = !state.sideBar.show;
  },
  sideBarMinToggle(state) {
    state.sideBar.min = !state.sideBar.min;
  },
};
/* eslint-enable no-param-reassign */

export {
  $state     as state,
  $getters   as getters,
  $mutations as mutations,
};
