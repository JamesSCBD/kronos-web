import path from 'path'
// import purgecss from '@fullhuman/postcss-purgecss'
import { ssoScbd, fontawesome, purgeCSS, dotEnvReader } from './configs'
dotEnvReader()

const config = {
  mode    : 'spa',
  parallel: true,
  modern  : true,
  head    : {
    title: process.env.npm_package_name || '',
    meta : [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading: { color: '#fff' },
  plugins: [ 'plugins/global-component-registry.js', 'plugins/fa-to-coreui-icons/index.js' ],
  css    : [
    { src: 'node_modules/@coreui/icons/css/all.min.css', lang: 'css' },
    { src: 'node_modules/bootstrap-vue/dist/bootstrap-vue.min.css', lang: 'css' },
    { src: '~/assets/scss/style.scss', lang: 'scss' } ],
  buildModules: [
    '@nuxtjs/eslint-module', // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/stylelint-module' // Doc: https://github.com/nuxt-community/stylelint-module
  ],
  modules: [
    '@nuxt/http', // Doc: https://axios.nuxtjs.org/usage
    'nuxt-purgecss',
  
    '@nuxtjs/pwa',
    'nuxt-fontawesome', // https://github.com/vaso2/nuxt-fontawesome#readme
    
    '@scbd/nuxt-scbd-sso-module'

  ],
  build: {
    extractCSS: true,
    extend (config, ctx){
      ctx.loaders.sass.sassOptions.quiet = true

      config.resolve.alias['@roles'] = path.join(__dirname, 'configs/roles.js')
      config.resolve.alias['@components'] = path.join(__dirname, 'components')

      if (ctx.isDev && ctx.isClient)
        config.module.rules.push({
          enforce: 'pre',
          test   : /\.(js|vue)$/,
          loader : 'eslint-loader',
          exclude: /(node_modules)/,
          options: { fix: true }
        })
      if (!ctx.isDev){
        config.resolve.alias['@coreui/vue']       = path.join(__dirname, 'node_modules/@coreui/vue/src')
        config.resolve.alias['bootstrap-vue/src'] = path.join(__dirname, 'node_modules/bootstrap-vue/src')
      }
    }

    // postcss: {
    //   plugins: [
    //     purgecss({
    //       content  : [ './pages/**/*.vue', './layouts/**/*.vue', './components/**/*.vue' ],
    //       whitelist: [ 'html', 'body' ]
    //     })
    //   ]
    // }
  },
  router: { linkActiveClass: 'active-link', middleware: [ 'redirects' ] },
  fontawesome,
  purgeCSS,
  ssoScbd,
  watch : [ 'node_modules/@scbd/nuxt-scbd-sso-module/src/middleware.js', 'node_modules/@scbd/nuxt-scbd-sso-module/src/index.js', 'node_modules/@scbd/sso-vue-plugin-scbd/src/plugin.js' ]
}

export default config
