import { mapGetters, mapMutations } from 'vuex'

export function gettersMap (){
  return mapGetters({
    isMin       : 'coreui/isMin',
    isShow      : 'coreui/isShow',
    selectedCode: 'conferences/selectedCode'
  })
}

export function mutationsMap (){
  return mapMutations({
    toggleShow: 'coreui/sideBarShowToggle',
    toggleMin : 'coreui/sideBarMinToggle'
  })
}
