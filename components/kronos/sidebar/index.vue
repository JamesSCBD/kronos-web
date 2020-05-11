<template>
  <CSidebar
    unfoldable
    :minimize="minimize"
    :show="show"
    @update:show="toggleSideBarVisible()"
  >
    <CSidebarBrand
      :img-full="{ width: 180, height: 46, alt: 'Logo', src: '/k-logo-full.svg'}"
      :img-minimized="{ width: 50, height: 55, alt: 'Logo', src: '/k-logo-mobi.svg'}"
      :wrapped-in-link="{ href: 'https://github.com/scbd/kronos-web', target: '_blank'}"
    />
    <Nav />
    <CSidebarMinimizer
      class="d-md-down-none"
      @click.native="toggleSideBarMinimized()"
    />
  </CSidebar>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { CSidebar, CSidebarBrand, CSidebarMinimizer } from '@coreui/vue';
import Nav from './Nav';

export default {
  name      : 'KSidebar',
  components: {
    CSidebar, CSidebarBrand, CSidebarMinimizer, Nav,
  },
  computed: {
    ...mapState([ 'coreui' ]),
    show() {
      return this.coreui.sidebarShow;
    },
    minimize() {
      return this.coreui.sidebarMinimize;
    },
  },
  methods: {
    ...mapActions({
      toggleSideBarVisible  : 'coreui/setSidebarResponsive',
      toggleSideBarMinimized: 'coreui/toggleSideBarMinimized',
    }),
  },
};
</script>
