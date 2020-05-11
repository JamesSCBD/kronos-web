const $state = () => ({
  sidebarShow    : 'responsive',
  sidebarMinimize: false,
});

/* eslint-disable no-param-reassign */
const TOGGLE_SIDEBAR_DESKTOP   = 'toggleSidebarDesktop';
const TOGGLE_SIDEBAR_MOBILE    = 'toggleSidebarMobile';
const TOGGLE_SIDEBAR_MINIMIZED = 'toggleSideBarMinimized';
const SET_SIDEBAR_RESPONSIVE   = 'setSidebarResponsive';

const $mutations = {

  [TOGGLE_SIDEBAR_DESKTOP](state) {
    const sidebarOpened = [ true, 'responsive' ].includes(state.sidebarShow);
    state.sidebarShow   = sidebarOpened ? false : 'responsive';
  },

  [TOGGLE_SIDEBAR_MOBILE](state) {
    const sidebarClosed = [ false, 'responsive' ].includes(state.sidebarShow);
    state.sidebarShow   = sidebarClosed ? true : 'responsive';
  },

  [SET_SIDEBAR_RESPONSIVE](state) {
    state.sidebarShow = 'responsive';
  },

  [TOGGLE_SIDEBAR_MINIMIZED](state) {
    state.sidebarMinimize = !state.sidebarMinimize;
  },
};

const $actions = {
  toggleSidebarDesktop({ commit }) {
    commit(TOGGLE_SIDEBAR_DESKTOP);
  },
  toggleSidebarMobile({ commit }) {
    commit(TOGGLE_SIDEBAR_MOBILE);
  },
  setSidebarResponsive({ commit }) {
    commit(SET_SIDEBAR_RESPONSIVE);
  },
  toggleSideBarMinimized({ commit }) {
    commit(TOGGLE_SIDEBAR_MINIMIZED);
  },
};
/* eslint-enable no-param-reassign */

export {
  $state     as state,
  $mutations as mutations,
  $actions   as actions,
};
