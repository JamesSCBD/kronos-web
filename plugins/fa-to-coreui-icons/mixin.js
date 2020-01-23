import { getFaJsSet } from './fa-to-cui-icon'

export default function (Vue){
  Vue.mixin({ beforeCreate: coreuiIconsInit })

  function coreuiIconsInit (){
    if (this.$root.$options.icons) return

    const faJsSet = getFaJsSet()
    const icons = {}

    for (const key in faJsSet)
      icons[key] = faJsSet[key]
    
    this.$root.$options.icons = icons
  }
}
