const sideBar = { show: true, min: false }

export const state     = () => ({ sideBar })
export const getters   = { isMin, isShow }
export const mutations = { sideBarShowToggle, sideBarMinToggle }

// geters
function isMin  ({ sideBar }){ return sideBar.min }
function isShow ({ sideBar }){ return sideBar.show }

// mutations
function sideBarShowToggle (state){ state.sideBar.show = !state.sideBar.show }
function sideBarMinToggle  (state){ state.sideBar.min = !state.sideBar.min }
