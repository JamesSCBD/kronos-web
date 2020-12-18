import   Vue                from 'vue';
import { plugin, ssoScbd } from '@scbd/sso-vue-plugin-scbd';
import   options            from '../../configs/sso-scbd';

Vue.use(plugin, options);

export default (ctx, inject) => {
  ssoScbd.$initSsoScbd();
  inject('ssoScbd', ssoScbd);
};
