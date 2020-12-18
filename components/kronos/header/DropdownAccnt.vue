<template>
  <CDropdown in-nav class="c-header-nav-items" placement="bottom-end" add-menu-classes="pt-0">
    <template #toggler>
      <CHeaderNavLink>
        <Avatar :username="$ssoScbd.me.name" />
      </CHeaderNavLink>
    </template>
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>Account</strong>
    </CDropdownHeader>
    <CDropdownDivider />
    <CDropdownItem
      :href="`${$ssoScbd.auth.accountsUrl}/profile`"
      target="_blank"
      rel="noopener"
    >
      <CIcon name="user" /> Profile
    </CDropdownItem>
    <CDropdownItem @click="$logOut(); $router.push('/login')">
      <CIcon name="signOutAlt" /> Logout
    </CDropdownItem>
  </CDropdown>
</template>

<script>
import {
  CDropdown, CDropdownHeader, CDropdownItem, CDropdownDivider, CHeaderNavLink,
} from '@coreui/vue';
import Avatar from 'vue-avatar';

export default {
  name      : 'DropdownAccnt',
  components: {
    Avatar, CDropdown, CDropdownHeader, CDropdownItem, CDropdownDivider, CHeaderNavLink,
  },
};

</script>

<style scoped>
.c-icon { margin-right: 0.3rem; }
</style>
