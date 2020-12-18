import path        from 'path';
import dotenv      from 'dotenv';
import fontawesome from './configs/fa';

dotenv.config({ debug: true });

export default {
  ssr     : false,
  parallel: true,
  modern  : true,
  head    : {
    title: process.env.npm_package_name || '',
    meta : [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },
  loading: { color: '#fff' },
  plugins: [
    'plugins/sso-scbd/index.js',
    'plugins/global-component-registry.js',
    'plugins/fa-to-coreui-icons/index.js',
    'plugins/register-apis.js',
    'plugins/global-filters.js',
  ],
  css: [
    { src: 'node_modules/@coreui/icons/css/all.min.css', lang: 'css' },
    { src: 'node_modules/bootstrap-vue/dist/bootstrap-vue.min.css', lang: 'css' },
    { src: '~/assets/scss/style.scss', lang: 'scss' }],
  modules: [
    '@nuxtjs/pwa',
    'nuxt-fontawesome', // https://github.com/vaso2/nuxt-fontawesome#readme
  ],
  build: {
    extractCSS: true,
    extend(config, ctx) {
      ctx.loaders.sass.sassOptions.quiet = true;

      config.resolve.alias['@roles'] = path.join(__dirname, 'configs/roles.js'); // eslint-disable-line no-param-reassign

      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test   : /\.(js|vue)$/,
          loader : 'eslint-loader',
          exclude: /(node_modules)/,
          options: { fix: true },
        });
      }
      if (!ctx.isDev) {
        config.resolve.alias['@coreui/vue']       = path.join(__dirname, 'node_modules/@coreui/vue/src'); // eslint-disable-line no-param-reassign
        config.resolve.alias['bootstrap-vue/src'] = path.join(__dirname, 'node_modules/bootstrap-vue/src'); // eslint-disable-line no-param-reassign
      }
    },
    babel: {
      plugins: [
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-export-namespace-from',
      ],
    },
  },
  router: { linkActiveClass: 'active-link', middleware: [ 'auth' ] },
  fontawesome,
};
