<template>
  <CSubheader class="px-3">
    <div class="col-4 p-0">
      <CBreadcrumb :items="makeCrumbs()" class="border-0" />
    </div>
    <div class="col-8 p-0">
      <ConferenceSelect />
    </div>
  </CSubheader>
</template>

<script>

import { CSubheader, CBreadcrumb } from '@coreui/vue'
import { capitalCase             } from 'change-case'
import   ConferenceSelect          from '@components/ConferenceSelect'

export default {
  name      : 'KHeader',
  components: { CBreadcrumb, CSubheader, ConferenceSelect },
  methods   : { makeCrumbs, is404, isParam: getRouteParamByName, getRouteParamByName, conferenceParamRoute }
}

function is404 (path){
  return !this.$router.resolve(path).resolved.matched.length
}

function getRouteParamByName (name){
  if (name.startsWith(':'))
    return this.$route.params[name.replace(':', '')]
}

function makeCrumbs (){ //eslint-disable-line

  const { path      } = this.$route.matched[0] || { path: '/' }
  const   pathSplit   = () => path.split('/').splice(1)
  const   crumbs      = [ ]

  if (!path) return [ ]

  for (let [ index, routeName ] of pathSplit().entries()){ //eslint-disable-line
    if (!routeName) continue

    let text

    if (this.isParam(routeName))
      text = this.conferenceParamRoute(routeName)
    else
      text = capitalCase(routeName)

    const to  = index ? '/' + pathSplit().splice(0, index + 1).join('/') : `/${routeName}`
    const crumb = this.isParam(routeName) ? { text, disabled: true } : { text, to }

    crumbs.push(crumb)
  }

  return crumbs
}

function conferenceParamRoute (routeParamName){
  if (routeParamName !== ':conferenceCode') return

  return this.getRouteParamByName(routeParamName)
}
</script>
