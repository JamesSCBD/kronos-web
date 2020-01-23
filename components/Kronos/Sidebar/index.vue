<template>
  <CSidebar fixed :minimize="isMin" :show="isShow" @update:show="toggleShow()">
    <CSidebarBrand
      :img-full="{ width: 180, height: 46, alt: 'Logo', src: '/k-logo-full.svg'}"
      :img-minimized="{ width: 50, height: 55, alt: 'Logo', src: '/k-logo-mobi.svg'}"
      :wrapped-in-link="{ href: 'https://github.com/scbd/kronos-web', target: '_blank'}"
    />
    <Nav />
    <CSidebarMinimizer class="d-md-down-none" @click.native="toggleMin()" />
  </CSidebar>
</template>

<script>
import { CSidebar, CSidebarBrand, CSidebarMinimizer } from '@coreui/vue'
import { gettersMap, mutationsMap }                     from '@components/Kronos/Sidebar/store-maps'
import   Nav                                            from './Nav'

export default {
  name      : 'KSidebar',
  components: { CSidebar, CSidebarBrand, CSidebarMinimizer, Nav },
  computed  : { ...gettersMap() },
  methods   : { ...mutationsMap() }
}
</script>
