<template>
  <CSidebar
    unfoldable
    :minimize="minimize"
    :show="show"
    @update:show="toggleSideBarVisible()"
  >
    <CSidebarBrand class="">
      <img
        class="c-sidebar-brand-full"
        src="/k-logo-full.svg"
        width="180"
        height="46"
        alt="Logo"
      >
      <img
        class="c-sidebar-brand-minimized"
        src="/k-logo-mobi.svg"
        width="50"
        height="55"
        alt="Logo"
      >
    </CSidebarBrand>
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
