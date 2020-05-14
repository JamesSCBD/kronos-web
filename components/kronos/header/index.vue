<template>
  <CHeader fixed light>
    <CToggler
      in-header
      class="ml-3 d-lg-none"
      @click="toggleSidebarMobile()"
    />
    <CToggler
      in-header
      class="ml-3 d-md-down-none"
      @click="toggleSidebarDesktop()"
    />

    <CHeaderNav class=" mr-auto">
      <CHeaderNavItem>
        <BreadCrumbs />
      </CHeaderNavItem>
    </CHeaderNav>

    <CHeaderNav class="mr-4">
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <!-- some icon messgeses maybe -->
        </CHeaderNavLink>
      </CHeaderNavItem>
      <DropdownContacts />
      <DropdownOrganizations />
      <DropdownAccnt />
    </CHeaderNav>
  </CHeader>
</template>

<script>
import { mapActions } from 'vuex';
import {
  CHeader, CHeaderNav, CHeaderNavItem, CHeaderNavLink, CToggler,
} from '@coreui/vue';
import BreadCrumbs from './BreadCrumbs';
import DropdownAccnt from './DropdownAccnt';
import DropdownContacts from './DropdownContacts';
import DropdownOrganizations from './DropdownOrganizations';

export default {
  name      : 'KHeader',
  components: {
    BreadCrumbs,
    DropdownAccnt,
    CHeader,
    CHeaderNav,
    CHeaderNavItem,
    CHeaderNavLink,
    CToggler,
    DropdownContacts,
    DropdownOrganizations,
  },
  methods: {
    ...mapActions({
      toggleSidebarDesktop: 'coreui/toggleSidebarDesktop',
      toggleSidebarMobile : 'coreui/toggleSidebarMobile',
    }),
  },
};

</script>
