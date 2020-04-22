import Vue from 'vue';
import { getFaJsSet } from './fa-to-cui-icon';

Vue.use((vue) => vue.mixin({ beforeCreate: coreuiIconsInit }));

function coreuiIconsInit() {
  if (this.$root.$options.icons) { return; }

  const faJsSet = getFaJsSet();
  const icons   = {};

  Object.keys(faJsSet).forEach((key) => { icons[key] = faJsSet[key]; });

  this.$root.$options.icons = icons;
}
