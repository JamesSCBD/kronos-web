
export function setSelected (state, payLoad){ state.selected = { ...{}, ...payLoad } }
export function set         (state, payLoad = []){ state.docs = payLoad }

export function clear (state){
  state.docs            = []
  state.selected        = false
}
